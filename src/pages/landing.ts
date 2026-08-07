import { Component, ComponentProps } from '../core/component.ts';
import { SearchSection } from '../components/search-section.ts';
import { PodcastList } from '../components/podcast-list.ts';

export class LandingPage extends Component {
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
    const searchSlot = this.element.querySelector<HTMLElement>('#search-slot');
    const podcastListSlot =
      this.element.querySelector<HTMLElement>('#podcast-list-slot');

    if (!searchSlot) throw new Error('нету #search-slot');
    if (!podcastListSlot) throw new Error('нету #podcast-list-slot');

    const podcastList = new PodcastList();
    podcastList.mount(podcastListSlot);

    const searchSection = new SearchSection({
      onSearch: (query: string) => {
        podcastList.fetchPodcasts(query);
      },
    });
    searchSection.mount(searchSlot);
  }
}
