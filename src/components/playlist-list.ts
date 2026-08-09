import { Component } from '../core/component';
import { PlaylistItem } from '../types/types';
import { PlaylistRow } from './playlist-row';
import { getPlaylist } from '../storage/playlist-storage';
import { removeFromPlaylist } from '../storage/playlist-storage';

interface EpisodeListState {
  playlistItems: PlaylistItem[];
}

export class PlaylistList extends Component {
  declare state: EpisodeListState;
  private rows: PlaylistRow[] = [];

  constructor() {
    super({
      tagName: 'section',
      className: 'tracklist-container',
    });

    this.state = {
      playlistItems: [],
    };
  }

  onMount(): void {
    this.setState({ playlistItems: getPlaylist() });
  }

  onUnmount(): void {
    this.rows.forEach((r) => r.unmount());
    this.rows = [];
  }

  private getHeaderHTML(): string {
    return `
      <div class="tracklist-header">
        <span class="header-num">#</span>
        <span class="header-title">Название</span>
        <span class="header-data">Дата добавления</span>
        <span class="header-time">
          <span class="icon icon-clock"></span>
        </span>
      </div>
      <hr class="tracklist-divider" />
    `;
  }

  render(): string {
    if (this.state.playlistItems.length === 0) {
      return `
        ${this.getHeaderHTML()}
        <div class="tracklist-body">
          <div class="episode-list-status">Нет эпизодов</div>
        </div>
      `;
    }
    return `
      ${this.getHeaderHTML()}
      <div class="tracklist-body"></div>
    `;
  }

  afterRender(): void {
    if (this.state.playlistItems.length === 0) return;

    const container =
      this.element.querySelector<HTMLElement>('.tracklist-body');
    if (!container) return;

    this.rows.forEach((r) => r.unmount());
    this.rows = [];

    this.state.playlistItems.forEach((playlistItem, index) => {
      const row = new PlaylistRow({
        playlistItem,
        index,
        onRemove: (episodeId: string) => {
          removeFromPlaylist(episodeId);
          this.setState({ playlistItems: getPlaylist() }); // ← перерисовка списка
        },
      });
      row.mount(container);
      this.rows.push(row);
    });
  }
}
