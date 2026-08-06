import { Component } from '../core/component';
import { Episode } from '../types/types';

interface EpisodeListProp {
  episodes: Episode[],
}
export class EpisodeList extends Component {
  constructor() {
    super({
      tagName: 'section',
      className: 'tracklist-container',
    });
  }

  render(): string {
    return `
      <div class="tracklist-header">
        <span class="header-num">#</span>
        <span class="header-title">Название</span>
        <span class="header-time">
          <span class="icon icon-clock"></span>
        </span>
      </div>

      <hr class="tracklist-divider" />

      <div class="tracklist-body"></div>
    `;
  }
}
