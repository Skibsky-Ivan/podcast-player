import { Component, ComponentProps } from '../core/component.ts';
import { SearchSection } from '../components/search-section.ts';
import { PodcastList } from '../components/podcast-list.ts';

export class LandingPage extends Component {
  private podcastList: PodcastList | null = null;
  private searchSection: SearchSection | null = null;

  constructor(props: ComponentProps = {}) {
    super({
      className: 'container',
      props,
    });
  }

  render(): string {
    return `
      <div id="search-slot"></div>

      <div id="podcast-list-slot"></div>
    `;
  }

  afterRender(): void {
    const podcastListSlot =
      this.element.querySelector<HTMLElement>('#podcast-list-slot');
    if (podcastListSlot) {
      this.podcastList = new PodcastList();
      this.podcastList.mount(podcastListSlot);
    }

    const searchSlot = this.element.querySelector<HTMLElement>('#search-slot');
    if (searchSlot) {
      this.searchSection = new SearchSection({
        onSearch: (query: string) => {
          this.podcastList?.fetchPodcasts(query);
        },
      });
      this.searchSection.mount(searchSlot);
    }
  }

  onUnmount(): void {
    this.podcastList?.unmount();
    this.podcastList = null;
    this.searchSection?.unmount();
    this.searchSection = null;
  }
}
