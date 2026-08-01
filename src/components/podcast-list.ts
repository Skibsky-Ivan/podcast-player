import { Component } from '../core/component';
import { PodcastCard } from './podcast-card';
import { getBasePodcasts } from '../api/podcast-index';
import { Podcast } from '../types/types';

interface PodcastListState {
  podcasts: Podcast[];
  isLoading: boolean;
  error: string | null;
}

export class PadcastList extends Component {
  declare state: PodcastListState;

  constructor() {
    super({
      tagName: 'section',
      className: 'podcast-list-container',
    });

    this.state = {
      podcasts: [],
      isLoading: false,
      error: null,
    };
  }

  onMount(): void {
    this.fetchPodcasts();

    this.element.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickCard = target.closest<HTMLElement>('.card');

      if (!(clickCard && clickCard.dataset.id)) return;

      const clickCardId = clickCard.dataset.id;

      console.log(`Клик по карточке с ID: ${clickCardId}`);
    });

    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const clickCard = target.closest<HTMLElement>('.podcast-list-retry-btn');

      if (!clickCard) return;

      this.fetchPodcasts();
    });
  }

  private async fetchPodcasts() {
    try {
      this.setState({ isLoading: true });
      const podcasts = await getBasePodcasts();
      this.setState({ podcasts, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'error when uploading';
      this.setState({ isLoading: false, error: errorMessage });
    }
  }

  render(): string {
    const { isLoading, error, podcasts } = this.state;
    if (isLoading) {
      return `
        <div class="podcast-list-status">
          <div class="spinner"></div>
          <span>Загрузка...</span>
        </div>
      `;
    }
    if (error) {
      return `
        <div class="podcast-list-status podcast-list-status--error">
          <p class="podcast-list-error-message">Ошибка: ${error}</p>
          <button class="podcast-list-retry-btn" type="button">Попробовать снова</button>
        </div>
      `;
    }
    if (podcasts.length === 0) {
      return `<div class="podcast-list-status">Подкасты не найдены</div>`;
    }
    return `
      <div class="podcast-list"></div>
    `;
  }

  afterRender(): void {
    const conatiner = this.element.querySelector<HTMLElement>('.podcast-list');
    if (!conatiner) return;

    this.state.podcasts.forEach((podcast) => {
      const card = new PodcastCard(podcast);
      card.mount(conatiner);
    });
  }
}
