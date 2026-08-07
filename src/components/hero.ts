import { Component } from '../core/component';
import type { Podcast } from '../types/types';

export class PodcastHero extends Component {
  declare props: Podcast;

  constructor(props: Podcast) {
    super({
      tagName: 'section',
      className: 'podcast-hero',
      props,
    });
  }

  render(): string {
    const podcast = this.props;

    return `
      <div class="container hero-container">
        <div class="hero-cover">
          <img 
            class="hero-img" 
            src="${podcast.coverUrl || ''}" 
            alt="${podcast.title || 'Podcast Cover'}" 
          />
        </div>
        <div class="hero-details">
          <h1 class="podcast-title">
            ${podcast.title || 'Название подкаста'}
          </h1>
          <div class="podcast-meta-author">
            ${podcast.author ? `<span class="author-name">${podcast.author}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }
}