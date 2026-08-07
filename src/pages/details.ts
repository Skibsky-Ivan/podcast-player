import { Component } from '../core/component.ts';
import { PodcastHero } from '../components/hero.ts';
import { EpisodeList } from '../components/episode-list.ts';
import { ControlsBar } from '../components/controls-bar.ts';
import { store } from '../core/state.ts';
import { getPodcastById } from '../api/podcast-index.ts';
import type { Podcast } from '../types/types.ts';

export class DetailsPage extends Component {
  declare props: { feedId: string };
  private hero: PodcastHero | null = null;
  private episodeList: EpisodeList | null = null;
  private controlsBar: ControlsBar | null = null;

  constructor(props: { feedId: string }) {
    super({
      tagName: 'main',
      className: 'main-container',
      props,
    });
  }

  onMount(): void {
    const feedId = this.props.feedId;
    const podcastFromStore = store.getPodcastById(feedId);

    if (podcastFromStore) {
      this.mountComponents(podcastFromStore);
    } else {
      getPodcastById(feedId)
        .then((podcast) => {
          store.setState({ currPodcast: podcast });
          this.mountComponents(podcast);
        })
        .catch(() => {
          this.showError('Не удалось загрузить подкаст');
        });
    }
  }

  onUnmount(): void {
    this.hero?.unmount();
    this.episodeList?.unmount();
    this.controlsBar?.unmount();
  }

  mountComponents(podcast: Podcast): void {
    const hero = this.element.querySelector<HTMLElement>('#hero-slot');
    const controlsBar =
      this.element.querySelector<HTMLElement>('#controls-bar-slot');
    const episodeList =
      this.element.querySelector<HTMLElement>('#episode-list-slot');

    if (hero) {
      this.hero = new PodcastHero(podcast);
      this.hero.mount(hero);
    }

    if (controlsBar) {
      this.controlsBar = new ControlsBar();
      this.controlsBar.mount(controlsBar);
    }

    if (episodeList) {
      this.episodeList = new EpisodeList(podcast.id);
      this.episodeList.mount(episodeList);
    }
  }

  private showError(message: string): void {
    const heroSlot = this.element.querySelector<HTMLElement>('#hero-slot');
    if (heroSlot) {
      heroSlot.innerHTML = `<p class="error-message">${message}</p>`;
    }
  }

  render(): string {
    return `
      <div id="hero-slot"></div>
      <div class="container">
        <div id="controls-bar-slot"></div>
        <div id="episode-list-slot"></div>
      </div>
    `;
  }
}
