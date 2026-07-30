import { Component } from '../core/component.ts';

type ComponentConstructor = new () => Component;

interface LayoutRule {
  prefix: string;
  layoutClass: ComponentConstructor;
}

export class HashRouter {
  private routes: Record<string, ComponentConstructor> = {};
  private layouts: LayoutRule[] = [];
  private rootElement: HTMLElement;

  private currLayout: Component | null = null;
  private currPage: Component | null = null;
  private currLayoutClass: ComponentConstructor | null = null;

  constructor(rootElementId: string) {
    const element = document.getElementById(rootElementId);
    if (!element) {
      throw new Error(`Контейнер с id "${rootElementId}" не найден в DOM!`);
    }

    this.rootElement = element;

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[data-link]');

      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (!href) return;
        this.navigate(href);
      }
    });
  }

  public addRoute(hash: string, pageClass: ComponentConstructor): void {
    this.routes[hash] = pageClass;
  }

  public addLayout(prefix: string, layoutClass: ComponentConstructor): void {
    this.layouts.push({ prefix, layoutClass });
    this.layouts.sort((a, b) => b.prefix.length - a.prefix.length);
  }

  private handleRoute(): void {
    const hash = window.location.hash.slice(1) || '/';

    const PageClass = this.routes[hash] || this.routes['/404'];
    if (!PageClass) {
      throw new Error(
        `Не найден pageClass для маршрута "${hash}" и не зарегистрирован /404`,
      );
    }

    const matchedLayout = this.layouts.find((rule) =>
      hash.startsWith(rule.prefix),
    );
    if (!matchedLayout) {
      throw new Error(`Не найден layoutClass для префикса пути "${hash}"`);
    }

    const TargetLayoutClass = matchedLayout.layoutClass;

    if (this.currPage) {
      this.currPage.unmount();
      this.currPage = null;
    }

    if (this.currLayoutClass !== TargetLayoutClass) {
      this.currLayout?.unmount();

      this.currLayout = new TargetLayoutClass();
      this.currLayout.mount(this.rootElement);
      this.currLayoutClass = TargetLayoutClass;
    }

    if (!this.currLayout) {
      throw new Error('Не удалось инициализировать Layout');
    }

    const outlet = this.currLayout.element.querySelector(
      '#outlet',
    ) as HTMLElement;
    if (!outlet) {
      throw new Error('Элемент #outlet не найден в макете (Layout)');
    }

    this.currPage = new PageClass();
    this.currPage.mount(outlet);
  }

  public navigate(hash: string): void {
    window.location.hash = hash;
  }
}
