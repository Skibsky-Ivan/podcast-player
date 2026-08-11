import { Component } from '../core/component';
import type { Episode } from '../types/types';
import { GlobalState, store } from '../core/state';
import { formatDuration } from '../utils/format-time';
import { router } from '../core/router.ts';
import {
  savePosition,
  getSavedPosition,
  clearPosition,
} from '../storage/playlist-storage.ts';

interface PlayerState {
  currEpisode: Episode | null;
  isPlaying: boolean;
}

export class Player extends Component {
  declare state: PlayerState;
  private audio: HTMLAudioElement = document.createElement('audio');
  private goToPodcastBtn: HTMLButtonElement | null = null;
  private playBtn: HTMLButtonElement | null = null;
  private playIcon: HTMLElement | null = null;
  private progressBar: HTMLInputElement | null = null;
  private timeDisplay: HTMLElement | null = null;
  private titleEl: HTMLElement | null = null;
  private coverEl: HTMLImageElement | null = null;
  private volumeSlider: HTMLInputElement | null = null;
  private speedSlider: HTMLInputElement | null = null;
  private isDragging: boolean = false;
  private pendingSeek: number | null = null;
  private unsubscribe: (() => void) | null = null;

  private onLoadedMetadata = (): void => {
    if (this.progressBar) this.progressBar.max = String(this.audio.duration);

    if (this.pendingSeek !== null) {
      const target = Math.max(0, this.pendingSeek);
      this.audio.currentTime = target;
      if (this.progressBar) this.progressBar.value = String(target);
      if (this.timeDisplay) {
        this.timeDisplay.textContent = `${formatDuration(target)} / ${this.state.currEpisode?.duration}`;
      }
      this.pendingSeek = null;
    }
  };

  private onTimeUpdate = (): void => {
    const currTime = Math.floor(this.audio.currentTime);
    if (this.timeDisplay)
      this.timeDisplay.textContent = `${formatDuration(currTime)} / ${this.state.currEpisode?.duration}`;

    if (this.isDragging) return;
    if (this.progressBar) {
      this.progressBar.value = String(currTime);
      this.updateSliderProgress(this.progressBar);
    }
    if (currTime > 0 && currTime % 3 === 0) {
      const episode = this.state.currEpisode;
      if (episode) savePosition(episode.id, currTime);
    }
  };

  private onEnded = (): void => {
    const episode = this.state.currEpisode;
    if (episode) clearPosition(episode.id);
    store.setState({ isPlaying: false });
  };

  private onPlayClick = (): void => {
    store.setState({ isPlaying: !store.getState().isPlaying });
  };

  private onProgressChange = (): void => {
    this.audio.currentTime = Number(this.progressBar?.value);
    if (this.progressBar) this.updateSliderProgress(this.progressBar);
  };

  private onProgressMouseDown = (): void => {
    this.isDragging = true;
  };

  private onMouseUp = (): void => {
    this.isDragging = false;
  };

  private onGoToPodcast = (): void => {
    const podcastId = store.getState().currEpisode?.podcastId;
    if (podcastId) {
      router.navigate(`/details/${podcastId}`);
    }
  };

  private onVolumeInput = (): void => {
    this.audio.volume = Number(this.volumeSlider?.value);
  };

  private onSpeedInput = (): void => {
    this.audio.playbackRate = Number(this.speedSlider?.value);
  };

  private updateSliderProgress(slider: HTMLInputElement): void {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const val = Number(slider.value);
    const percent = ((val - min) / (max - min)) * 100;
    slider.style.setProperty('--progress', `${percent}%`);
  }

  private persistPlaybackPosition = (): void => {
    const episode = store.getState().currEpisode;
    const time = this.audio.currentTime;
    if (episode && time > 0) {
      savePosition(episode.id, time);
    }
  };

  constructor() {
    super({
      tagName: 'aside',
      className: 'player',
    });

    this.state = {
      currEpisode: store.getState().currEpisode,
      isPlaying: false,
    };
  }

  onMount(): void {
    this.element.appendChild(this.audio);

    this.unsubscribe = store.subscribe((state) => {
      this.handleStoreChange(state);
    });

    this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.addEventListener('timeupdate', this.onTimeUpdate);
    this.audio.addEventListener('ended', this.onEnded);
    this.playBtn?.addEventListener('click', this.onPlayClick);
    this.progressBar?.addEventListener('change', this.onProgressChange);
    this.progressBar?.addEventListener('mousedown', this.onProgressMouseDown);
    this.goToPodcastBtn?.addEventListener('click', this.onGoToPodcast);
    this.volumeSlider?.addEventListener('input', this.onVolumeInput);
    this.speedSlider?.addEventListener('input', this.onSpeedInput);
    [this.volumeSlider, this.speedSlider].forEach((slider) => {
      if (!slider) return;
      this.updateSliderProgress(slider);
      slider.addEventListener('input', () => this.updateSliderProgress(slider));
    });
    window.addEventListener('beforeunload', this.persistPlaybackPosition);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  handleStoreChange(state: GlobalState): void {
    const currEpisodeId = this.state.currEpisode?.id;
    const newEpisode = state.currEpisode;

    this.element.classList.toggle('player--empty', !newEpisode);

    if (currEpisodeId !== newEpisode?.id) {
      this.pendingSeek = null;

      if (newEpisode) {
        this.audio.src = newEpisode.audioUrl;

        if (this.progressBar) {
          this.progressBar.value = '0';
          this.updateSliderProgress(this.progressBar);
        }

        const saved = getSavedPosition(newEpisode.id);
        if (saved !== null) {
          this.pendingSeek = Math.max(0, saved - 10);
        }

        if (this.titleEl) this.titleEl.textContent = newEpisode.title || '';
        if (this.coverEl) this.coverEl.src = newEpisode.coverUrl || '';
        if (this.timeDisplay) {
          this.timeDisplay.textContent = `00:00 / ${newEpisode.duration}`;
        }

        if (state.isPlaying) this.audio.play();
      } else {
        this.audio.src = '';
        if (this.titleEl) this.titleEl.textContent = 'Выберите эпизод';
        if (this.coverEl) this.coverEl.src = '';
        if (this.progressBar) this.progressBar.value = '0';
        if (this.timeDisplay) this.timeDisplay.textContent = '00:00 / 00:00';
      }
    } else if (state.isPlaying !== this.state.isPlaying) {
      if (state.isPlaying) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    }

    if (this.playIcon) {
      this.playIcon.className = state.isPlaying
        ? 'icon icon-pause'
        : 'icon icon-play';
    }

    this.state = { currEpisode: state.currEpisode, isPlaying: state.isPlaying };
  }

  onUnmount(): void {
    this.audio.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this.audio.removeEventListener('timeupdate', this.onTimeUpdate);
    this.audio.removeEventListener('ended', this.onEnded);
    this.playBtn?.removeEventListener('click', this.onPlayClick);
    this.progressBar?.removeEventListener('change', this.onProgressChange);
    this.progressBar?.removeEventListener(
      'mousedown',
      this.onProgressMouseDown,
    );
    this.goToPodcastBtn?.removeEventListener('click', this.onGoToPodcast);
    this.volumeSlider?.removeEventListener('input', this.onVolumeInput);
    this.speedSlider?.removeEventListener('input', this.onSpeedInput);
    window.removeEventListener('beforeunload', this.persistPlaybackPosition);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.unsubscribe?.();
  }

  render(): string {
    return `
      <input type="range" class="player-progress-top" min="0" max="0" value="0">

      <div class="player-left">
        <button class="control-btn" id="go-to-podcast-btn" title="переход к подкасту">
          <span class="icon icon-previous"></span>
        </button>
        <button class="control-btn" id="play-btn" title="Играть / Пауза">
          <span class="icon icon-play"></span>
        </button>

        <span class="time-display">00:00 / 00:00</span>
      </div>

      <div class="player-center">
        <div class="player-cover-container">
          <img class="player-cover" src="" alt="" loading="lazy" />
        </div>
        <div class="player-text">
          <h2 class="player-title">Выберите эпизод</h2>
        </div>
      </div>

      <div class="player-right">
        <div class="player-volume-wrapper">
          <button class="control-btn" id="volume-btn" title="Громкость">
            <span class="icon icon-volume"></span>
          </button>
          <input type="range" class="player-slider player-volume-slider" 
                min="0" max="1" step="0.1" value="1">
        </div>
        <div class="player-speed-wrapper">
          <button class="control-btn" id="speed-btn" title="Скорость">
            <span class="icon icon-speed"></span>
          </button>
          <input type="range" class="player-slider player-speed-slider" 
                min="0.5" max="2" step="0.25" value="1">
        </div>
      </div> 
    `;
  }

  afterRender(): void {
    this.goToPodcastBtn = this.element.querySelector('#go-to-podcast-btn');
    this.playBtn = this.element.querySelector('#play-btn');
    this.playIcon = this.element.querySelector('#play-btn .icon');
    this.progressBar = this.element.querySelector('.player-progress-top');
    this.timeDisplay = this.element.querySelector('.time-display');
    this.titleEl = this.element.querySelector('.player-title');
    this.coverEl = this.element.querySelector('.player-cover');
    this.volumeSlider = this.element.querySelector('.player-volume-slider');
    this.speedSlider = this.element.querySelector('.player-speed-slider');
  }
}
