import { Component } from '../core/component.ts';
import { router } from '../core/router.ts';

export class ControlsBar extends Component {
  constructor(props: any = {}) {
    super({
      tagName: 'div',
      className: 'controls-bar',
      props,
    });
  }

  onMount(): void {
    const backBtn =
      this.element.querySelector<HTMLElement>('.controls-back-btn');
    backBtn?.addEventListener('click', () => {
      router.navigate('/');
    });
  }

  render(): string {
    return `
      <div class="actions-group">
        <button class="main-play-btn" type="button" title="Воспроизвести">
          <span class="icon icon-play play-icon-inner"></span>
        </button>

        <button class="action-icon-btn" type="button" title="Добавить">
          <span class="icon icon-plus"></span>
        </button>
      </div>

      <button class="controls-back-btn" type="button" title="Назад к плейлистам">
        <span class="icon icon-arrow-left"></span>
        <span>Назад</span>
      </button>
    `;
  }
}
