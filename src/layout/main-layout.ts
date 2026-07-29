import { Component } from '../core/component';
import { Header } from './header';

export class MainLayout extends Component {
  render(): string {
    return `
      <div id="header-slot"></div>
      
      <div id="outlet"></div>

      <div id="player-slot"></div>
    `;
  }

  afterRender(): void {
    const headerSlot = this.element.querySelector('#header-slot');

    if (headerSlot) {
      const header = new Header();
      header.mount(headerSlot as HTMLElement);
    }
  }
}
