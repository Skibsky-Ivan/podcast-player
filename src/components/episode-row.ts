import { Component } from '../core/component';
import type { Episode } from '../types/types';

export class EpisodeRow extends Component {
  declare props: {
    episode: Episode;
    index: number;
  };

  constructor(episode: Episode, index: number) {
    super({
      tagName: 'article',
      className: 'track-row',
      props: { episode, index },
    });
  }

  render(): string {
    const { episode, index } = this.props;

    return `
      <div class="track-num">
        <span class="num-text">${index + 1}</span>
        <span class="icon icon-play num-play"></span>
      </div>
      <div class="track-info">
        <h2 class="track-title">
          ${episode.title || 'Без названия'}
        </h2>
        <p class="track-author">${episode.author || ''}</p>
      </div>
      <div class="track-meta">
        <button class="track-add-btn" title="Добавить">
          <span class="icon icon-plus"></span>
        </button>
        <span class="track-duration">${episode.duration || ''}</span>
      </div>
    `;
  }
}