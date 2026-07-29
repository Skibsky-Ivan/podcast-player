import { Component, ComponentProps } from '../core/component.ts';

export class Header extends Component {
  constructor(props: ComponentProps = {}) {
    super({
      tagName: 'header',
      className: 'header container',
      props,
    });
  }

  render(): string {
    return `
      <a href="/" class="logo" data-link>
        <span class="icon icon-audio-wave logo-icon"></span>
        <span class="logo-text">AudioWave</span>
      </a>
      <nav class="nav">
        <a href="/" class="nav-link active" data-link>
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
