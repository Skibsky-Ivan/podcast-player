import { Component, ComponentProps } from '../core/component.ts';
import { router } from '../core/router.ts';

export class Header extends Component {
  private unsubscribe: (() => void) | null = null;

  constructor() {
    super({
      tagName: 'header',
      className: 'header container',
    });
  }

  onMount(): void {
    this.unsubscribe = router.onRouterChange((path) => {
      this.updateActiveClass(path);
    });
  }

  onUnmount(): void {
    this.unsubscribe?.();
  }

  private updateActiveClass(currPath: string): void {
    const links = this.element.querySelectorAll<HTMLElement>('.nav-link');

    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isActive = (currPath === href) || currPath.startsWith(`${href}/`);
      link.classList.toggle('active', isActive);
    });
  }

  render(): string {
    return `
      <a href="/" class="logo" data-link>
        <span class="icon icon-audio-wave logo-icon"></span>
        <span class="logo-text">AudioWave</span>
      </a>
      <nav class="nav">
        <a href="/" class="nav-link" data-link>
          <span class="icon icon-home"></span>
          <span>Home</span>
        </a>
        <a href="/playlist" class="nav-link" data-link>
          <span class="icon icon-playlist"></span>
          <span>Playlist</span>
        </a>
      </nav>
    `;
  }
}
