import { Component } from '../core/component';
import type { Episode } from '../types/types';

interface EpisodeRowProps {
  episode: Episode;
  index: number;
  author: string;
  podcastCoverUrl: string;
}
export class EpisodeRow extends Component {
  declare props: EpisodeRowProps;

  constructor(props: EpisodeRowProps) {
    super({
      tagName: 'article',
      className: 'track-row',
      props,
    });
  }

  render(): string {
    const { episode, index, author, podcastCoverUrl } = this.props;
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
          <p class="track-author">${author || ''}</p>
        </div>
      </div>
      <div class="track-meta">
        <span class="track-date">${episode.pubDate}</span>
        <button class="track-add-btn" title="Добавить">
          <span class="icon icon-plus"></span>
        </button>
        <span class="track-duration">${episode.duration || ''}</span>
      </div>
    `;
  }
}
