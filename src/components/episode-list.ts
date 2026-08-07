import { Component } from '../core/component';
import { Episode } from '../types/types';
import { getEpisodesByFeedId } from '../api/podcast-index';
import { EpisodeRow } from './episode-row';

interface EpisodeListState {
  episodes: Episode[];
  isLoading: boolean;
  error: string | null;
}

interface EposodeListProps {
  feedId: string;
}
export class EpisodeList extends Component {
  declare props: EposodeListProps;
  declare state: EpisodeListState;
  private abortController: AbortController | null = null;

  constructor(feedId: string) {
    super({
      tagName: 'section',
      className: 'tracklist-container',
      props: { feedId },
    });

    this.state = {
      episodes: [],
      isLoading: true,
      error: null,
    };
  }

  onMount(): void {
    this.fetchEpisodes();

    this.element.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const clickCard = target.closest<HTMLElement>('.episode-list-retry-btn');

      if (!clickCard) return;

      this.fetchEpisodes();
    });
  }

  public async fetchEpisodes(): Promise<void> {
    if (this.abortController) this.abortController.abort();
    this.abortController = new AbortController();

    try {
      this.setState({ isLoading: true });
      const episodes = await getEpisodesByFeedId(
        this.props.feedId,
        50,
        this.abortController.signal,
      );
      this.setState({ episodes: episodes, isLoading: false });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;

      const errorMessage =
        error instanceof Error ? error.message : 'error when uploading';
      this.setState({ isLoading: false, error: errorMessage });
    }
  }

  private getHeaderHTML(): string {
    return `
      <div class="tracklist-header">
        <span class="header-num">#</span>
        <span class="header-title">Название</span>
        <span class="header-time">
          <span class="icon icon-clock"></span>
        </span>
      </div>
      <hr class="tracklist-divider" />
    `;
  }

  render(): string {
    const { episodes, isLoading, error } = this.state;
    if (isLoading) {
      return `
        ${this.getHeaderHTML()}
        <div class="tracklist-body">
          <div class="episode-list-status">
            <div class="spinner"></div>
            <span>Загрузка эпизодов...</span>
          </div>
        </div>
      `;
    }
    if (error) {
      return `
        ${this.getHeaderHTML()}
        <div class="tracklist-body">
          <div class="episode-list-status episode-list-status--error">
            <p class="episode-list-error-message">Ошибка: ${error}</p>
            <button class="episode-list-retry-btn" type="button">Попробовать снова</button>
          </div>
        </div>
      `;
    }
    if (episodes.length === 0) {
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
    if (
      this.state.isLoading ||
      this.state.error ||
      this.state.episodes.length === 0
    )
      return;

    const container =
      this.element.querySelector<HTMLElement>('.tracklist-body');
    if (!container) return;

    this.state.episodes.forEach((episode, index) => {
      const row = new EpisodeRow(episode, index);
      row.mount(container);
    });
  }
}
