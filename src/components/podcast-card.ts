import { Component } from '../core/component.ts';
import type { Podcast } from '../types/types.ts';

export class PodcastCard extends Component {
  constructor(props: Podcast) {
    super({
      tagName: 'article',
      className: 'card',
      dataset: { id: props.id },
      props,
    });
  }

  render(): string {
    const podcast = this.props;

    return `
      <div class="card-cover-wrapper">
        <img 
          class="card-img" 
          src="${podcast.coverUrl || ''}" 
          alt="${podcast.title || 'Podcast Cover'}" 
          loading="lazy" 
        />
      </div>
      <div class="card-content">
        <h3 class="card-title">${podcast.title || 'Название подкаста'}</h3>
        <p class="card-author">${podcast.author || 'Автор подкаста'}</p>
      </div>
    `;
  }
}
