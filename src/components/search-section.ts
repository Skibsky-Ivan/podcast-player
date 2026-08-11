import { Component, ComponentProps } from '../core/component.ts';
import { debounce } from '../utils/debounce.ts';

export class SearchSection extends Component {
  constructor(props: ComponentProps = {}) {
    super({
      tagName: 'section',
      className: 'section-top',
      props,
    });
  }

  private handlerInput = debounce((e: Event) => {
    const target = e.target as HTMLInputElement;
    const query = target.value.trim();

    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }

    window.history.replaceState({}, '', url.toString());

    const onSearch = this.props.onSearch;
    if (typeof onSearch === 'function') {
      onSearch(query);
    }
  });

  onMount(): void {
    const url = new URL(window.location.href);
    const initialQuery = url.searchParams.get('q') || '';

    const onSearch = this.props.onSearch;
    if (typeof onSearch === 'function') {
      onSearch(initialQuery);
    }
  }

  render(): string {
    return `
      <div class="title-block">
        <h1 class="main-title">Best Podcasts</h1>
      </div>

      <form class="search-wrapper" role="search" id="search-form">
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

  afterRender(): void {
    const form = this.element.querySelector<HTMLFormElement>('#search-form');
    const input = this.element.querySelector<HTMLInputElement>('#search-input');

    if (!form) throw new Error('нету #search-form');
    if (!input) throw new Error('нету #search-input');

    const url = new URL(window.location.href);
    input.value = url.searchParams.get('q') || '';

    form.addEventListener('submit', (e) => e.preventDefault());
    input.addEventListener('input', this.handlerInput);
  }
}
