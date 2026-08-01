export type ComponentProps = Record<string, any>;
export type ComponentState = Record<string, any>;

export interface ComponentOptions {
  tagName?: string;
  className?: string;
  dataset?: Record<string, string>;
  props?: ComponentProps;
}

export class Component {
  props: ComponentProps;
  state: ComponentState;
  element: HTMLElement;

  constructor(options: ComponentOptions = {}) {
    const {
      tagName = 'div',
      className = '',
      dataset = {},
      props = {},
    } = options;

    this.props = props;
    this.state = {};

    this.element = document.createElement(tagName);
    if (className) this.element.className = className;
    if (dataset) Object.assign(this.element.dataset, dataset);
  }

  setState(newState: ComponentState): void {
    const prevState: ComponentState = { ...this.state };
    this.state = { ...prevState, ...newState };
    this.onStateChanges(prevState, this.state);
    this.update();
  }

  onStateChanges(prevState: ComponentState, newState: ComponentState): void {}
  onMount(): void {}
  onUnmount(): void {}

  render(): string {
    return '';
  }

  update(): void {
    this.element.innerHTML = this.render();
    this.afterRender();
  }

  afterRender() {}

  mount(container: HTMLElement): void {
    this.update();
    container.appendChild(this.element);
    this.onMount();
  }

  unmount(): void {
    this.onUnmount();
    this.element.remove();
  }
}
