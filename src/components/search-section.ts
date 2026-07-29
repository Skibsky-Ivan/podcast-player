import { Component, ComponentProps } from '../core/component.ts';

export class SearchSection extends Component {
  constructor(props: ComponentProps = {}) {
    super({
      tagName: 'section',
      className: 'section-top',
      props,
    });
  }
  
  render(): string {
    return `
      <div class="title-block">
        <h1 class="main-title">Best Podcasts</h1>
      </div>

      <form class="search-wrapper" role="search" action="#" id="search-form">
        <span class="icon icon-magnifier search-icon"></span>
        <input
          type="search"
          class="search-input"
          id="search-input"
          placeholder="Search podcasts..."
          aria-label="Поиск подкастов" 
        />
      </form>
    `;
  }
}
