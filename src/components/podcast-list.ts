import { Component } from '../core/component';
import { PodcastCard } from './podcast-card';
import { getBasePodcasts, getSearchPodcasts } from '../api/podcast-index';
import { store } from '../core/state';
import { router } from '../core/router';
import type { Podcast } from '../types/types';

interface PodcastListState {
  podcasts: Podcast[];
  isLoading: boolean;
  error: string | null;
  currentQuery: string;
}

export class PodcastList extends Component {
  declare state: PodcastListState;
  private abortController: AbortController | null = null;
  private cards: PodcastCard[] = [];

  constructor() {
    super({
      tagName: 'section',
      className: 'podcast-list-container',
    });

    this.state = {
      podcasts: [],
      isLoading: true,
      error: null,
      currentQuery: '',
    };
  }

  onMount(): void {
    this.element.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const podcast = target.closest<HTMLElement>('.card');

      if (!(podcast && podcast.dataset.id)) return;

      const podcastId = podcast.dataset.id;

      const currPodcast = store.getPodcastById(podcastId);
      store.setState({ currPodcast: currPodcast });
      router.navigate(`/details/${podcastId}`);
    });

    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const clickCard = target.closest<HTMLElement>('.podcast-list-retry-btn');

      if (!clickCard) return;

      this.fetchPodcasts();
    });
  }

  onUnmount(): void {
    this.cards.forEach((c) => c.unmount());
    this.cards = [];
    this.abortController?.abort();
  }

  public async fetchPodcasts(query?: string) {
    if (this.abortController) this.abortController.abort();

    this.abortController = new AbortController();

    try {
      this.setState({ isLoading: true, currentQuery: query });

      const signal = this.abortController.signal;
      const podcasts = query
        ? await getSearchPodcasts(query, 20, signal)
        : await getBasePodcasts(20, signal);

      this.setState({ podcasts, isLoading: false });
      store.setState({ podcasts });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;

      const errorMessage =
        error instanceof Error ? error.message : 'error when uploading';
      this.setState({ isLoading: false, error: errorMessage });
    }
  }

  render(): string {
    const { isLoading, error, podcasts, currentQuery } = this.state;
    if (isLoading) {
      return `
        <div class="podcast-list-status">
          <div class="spinner"></div>
          <span>
            ${currentQuery ? `Поиск "${currentQuery}"...` : 'Загрузка...'}
          </span>
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
      return `
        <div class="podcast-list-status">
          ${
            currentQuery
              ? `По запросу "${currentQuery}" ничего не найдено`
              : 'Подкасты не найдены'
          }
        </div>
      `;
    }
    return `<div class="podcast-list"></div>`;
  }

  afterRender(): void {
    const container = this.element.querySelector<HTMLElement>('.podcast-list');
    if (!container) return;

    this.cards.forEach((c) => c.unmount());
    this.cards = [];

    this.state.podcasts.forEach((podcast) => {
      const card = new PodcastCard(podcast);
      card.mount(container);
      this.cards.push(card);
    });
  }
}
