import { Component } from '../core/component';
import type { PlaylistItem } from '../types/types';
import { GlobalState, store } from '../core/state';
import {
  isInPlaylist,
  removeFromPlaylist,
  addToPlaylist,
} from '../storage/playlist-storage';
import { router } from '../core/router.ts';

interface PlaylistRowProps {
  playlistItem: PlaylistItem;
  index: number;
  onRemove?: (episodeId: string) => void;
}

export class PlaylistRow extends Component {
  declare props: PlaylistRowProps;
  private unsubscribe: (() => void) | null = null;

  constructor(props: PlaylistRowProps) {
    super({
      tagName: 'article',
      className: 'track-row',
      props,
    });
  }

  private onPlayToggle = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest('.track-toggle-btn')) return;
    if (target.closest('.track-podcast')) return;

    const isCurrent =
      store.getState().currEpisode?.id === this.props.playlistItem.episode.id;

    if (isCurrent) {
      store.setState({ isPlaying: !store.getState().isPlaying });
    } else {
      store.setState({
        currEpisode: this.props.playlistItem.episode,
        isPlaying: true,
      });
    }
  };

  private playlistToggle = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (!target.closest('.track-toggle-btn')) return;

    const episodeId = this.props.playlistItem.episode.id;
    const episode = this.props.playlistItem.episode;
    const { podcastTitle, podcastAuthor, podcastCoverUrl } =
      this.props.playlistItem;

    if (isInPlaylist(episodeId)) {
      removeFromPlaylist(episodeId);
      this.props.onRemove?.(episodeId);
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
    const isAdded = isInPlaylist(this.props.playlistItem.episode.id);
    const btn = this.element.querySelector('.track-toggle-btn .icon');
    if (btn) {
      btn.className = isAdded ? 'icon icon-check-mark' : 'icon icon-plus';
    }
  }

  private onPodcastClick = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (!target.closest('.track-podcast')) return;

    const podcastId = this.props.playlistItem.episode.podcastId;
    if (podcastId) {
      router.navigate(`/details/${podcastId}`);
    }
  };

  onMount(): void {
    this.syncWithPlayer(store.getState());
    this.element.addEventListener('click', this.onPlayToggle);
    this.element.addEventListener('click', this.playlistToggle);
    this.element.addEventListener('click', this.onPodcastClick);
    this.unsubscribe = store.subscribe((state) => {
      this.syncWithPlayer(state);
    });
  }

  private syncWithPlayer(state: GlobalState): void {
    const isCurrent =
      state.currEpisode?.id === this.props.playlistItem.episode.id;

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
    this.element.removeEventListener('click', this.onPodcastClick);
    this.unsubscribe?.();
  }

  render(): string {
    const episode = this.props.playlistItem.episode;
    const podcastAuthor = this.props.playlistItem.podcastAuthor;
    const podcastTitle = this.props.playlistItem.podcastTitle;
    const podcastCoverUrl = this.props.playlistItem.podcastCoverUrl;
    const addedDate = new Date(
      this.props.playlistItem.addedAt,
    ).toLocaleDateString('ru-RU');
    const index = this.props.index;
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
          <p class="track-podcast" data-podcast-id="${episode.podcastId}">
            ${podcastTitle || ''}
          </p>
        </div>
      </div>
      <div class="track-meta">
        <span class="track-date">${addedDate}</span>
        <button class="track-toggle-btn" title="Удалить из плейлиста">
          <span class="icon icon-check-mark"></span>
        </button>
        <span class="track-duration">${episode.duration || ''}</span>
      </div>
    `;
  }
}
