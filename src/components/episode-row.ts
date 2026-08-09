import { Component } from '../core/component';
import type { Episode } from '../types/types';
import { GlobalState, store } from '../core/state';
import {
  isInPlaylist,
  removeFromPlaylist,
  addToPlaylist,
} from '../storage/playlist-storage';

interface EpisodeRowProps {
  episode: Episode;
  podcastAuthor: string;
  podcastTitle: string;
  podcastCoverUrl: string;
  index: number;
}
export class EpisodeRow extends Component {
  declare props: EpisodeRowProps;
  private unsubscribe: (() => void) | null = null;

  private playlistToggle = (e: MouseEvent): void => {
    const isAddBtn = (e.target as HTMLElement).closest('.track-toggle-btn');
    if (!isAddBtn) return;

    const episodeId = this.props.episode.id;
    const episode = this.props.episode;
    const podcastTitle = this.props.podcastTitle;
    const podcastAuthor = this.props.podcastAuthor;
    const podcastCoverUrl = this.props.podcastCoverUrl;

    if (isInPlaylist(episodeId)) {
      removeFromPlaylist(episodeId);
    } else {
      addToPlaylist({
        episode,
        podcastTitle,
        podcastAuthor,
        podcastCoverUrl,
        addedAt: Date.now(),
      });
    }

    this.updatePlaylistIcon();
  };

  private updatePlaylistIcon(): void {
    const isAdded = isInPlaylist(this.props.episode.id);
    const btn = this.element.querySelector('.track-toggle-btn .icon');
    if (btn) {
      btn.className = isAdded ? 'icon icon-check-mark' : 'icon icon-plus';
    }
  }

  private onPlayToggle = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest('.track-toggle-btn')) return;

    const isCurrent =
      store.getState().currEpisode?.id === this.props.episode.id;
    if (isCurrent) {
      store.setState({ isPlaying: !store.getState().isPlaying });
    } else {
      store.setState({ currEpisode: this.props.episode, isPlaying: true });
    }
  };

  constructor(props: EpisodeRowProps) {
    super({
      tagName: 'article',
      className: 'track-row',
      props,
    });
  }

  onMount(): void {
    this.updatePlaylistIcon();
    this.syncWithPlayer(store.getState());

    this.element.addEventListener('click', this.onPlayToggle);
    this.element.addEventListener('click', this.playlistToggle);

    this.unsubscribe = store.subscribe((state) => {
      this.syncWithPlayer(state);
    });
  }

  private syncWithPlayer(state: GlobalState): void {
    const isCurrent = state.currEpisode?.id === this.props.episode.id;

    this.element.classList.toggle('active-track', isCurrent);

    const numText = this.element.querySelector('.num-text');
    const numPlay = this.element.querySelector('.num-play');

    if (isCurrent) {
      numText?.classList.add('hidden');
      numPlay?.classList.remove('hidden');
      numPlay?.classList.toggle('icon-pause', state.isPlaying);
      numPlay?.classList.toggle('icon-play', !state.isPlaying);
    } else {
      numText?.classList.remove('hidden');
      numPlay?.classList.add('hidden');
    }
  }

  onUnmount(): void {
    this.element.removeEventListener('click', this.onPlayToggle);
    this.element.removeEventListener('click', this.playlistToggle);
    this.unsubscribe?.();
  }

  render(): string {
    const { episode, index } = this.props;
    const podcastAuthor = this.props.podcastAuthor;
    const podcastCoverUrl = this.props.podcastCoverUrl;
    const coverUrl = episode.coverUrl || podcastCoverUrl;

    return `
      <div class="track-num">
        <span class="num-text">${index + 1}</span>
        <span class="icon icon-play num-play"></span>
      </div>
      <div class="track-info">
        <img class="track-cover" src="${coverUrl}" alt="" loading="lazy" />
        <div class="track-text">
          <h2 class="track-title">${episode.title || 'Без названия'}</h2>
          <p class="track-author">${podcastAuthor || ''}</p>
        </div>
      </div>
      <div class="track-meta">
        <span class="track-date">${episode.pubDate}</span>
        <button class="track-toggle-btn" title="Добавить в плейлист">
          <span class="icon icon-plus"></span>
        </button>
        <span class="track-duration">${episode.duration || ''}</span>
      </div>
    `;
  }
}
