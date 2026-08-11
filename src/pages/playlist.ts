import { Component } from '../core/component.ts';
import { PlaylistList } from '../components/playlist-list';

export class PlaylistPage extends Component {
  private playlistList: PlaylistList | null = null;

  constructor() {
    super({
      tagName: 'main',
      className: 'main-container',
    });
  }

  onMount(): void {
    const playlistList =
      this.element.querySelector<HTMLElement>('#playlist-list-slot');
    if (playlistList) {
      this.playlistList = new PlaylistList();
      this.playlistList.mount(playlistList);
    }
  }

  onUnmount(): void {
    this.playlistList?.unmount();
    this.playlistList = null;
  }

  render(): string {
    return `
      <div class="container">
        <div id="playlist-list-slot"></div>
      </div>
    `;
  }
}
