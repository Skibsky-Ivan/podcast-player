import { Component } from '../core/component';
import { Header } from './header';
import { Player } from './player';

export class MainLayout extends Component {
  private header: Header | null = null;
  private player: Player | null = null;

  render(): string {
    return `
      <div id="header-slot"></div>
      
      <div id="outlet"></div>

      <div id="player-slot"></div>
    `;
  }

  afterRender(): void {
    const headerSlot = this.element.querySelector('#header-slot');
    if (headerSlot && !this.header) {
      this.header = new Header();
      this.header.mount(headerSlot as HTMLElement);
    }

    const playerSlot = this.element.querySelector('#player-slot');
    if (playerSlot && !this.player) {
      this.player = new Player();
      this.player.mount(playerSlot as HTMLElement);
    }
  }

  onUnmount(): void {
    this.header?.unmount();
    this.header = null;
    this.player?.unmount();
    this.player = null;
  }
}
