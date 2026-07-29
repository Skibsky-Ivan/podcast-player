import { Component, ComponentProps } from '../core/component.ts';
import { SearchSection } from '../components/search-section.ts';

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
    const searchSlot = this.element.querySelector('#search-slot');
    const podcastGridSlot = this.element.querySelector('#podcast-list-slot');

    if (searchSlot) {
      const searchSection = new SearchSection();
      searchSection.mount(searchSlot as HTMLElement);
    }

    if (podcastGridSlot) {
      // podcast-list
    }
  }
}
