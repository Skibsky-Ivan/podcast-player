import { Component } from './component.ts';

type ComponentConstructor = new (props?: any) => Component;
type RouterChangeListiner = (path: string, param: Record<string, any>) => void;

interface LayoutRule {
  prefix: string;
  layoutClass: ComponentConstructor;
}

interface RouterRule {
  regex: RegExp;
  paramNames: string[] | null;
  pageClass: ComponentConstructor;
}

class HashRouter {
  private routes: RouterRule[] = [];
  private layouts: LayoutRule[] = [];
  private rootElement: HTMLElement;
  private listeners: RouterChangeListiner[] = [];

  private currLayout: Component | null = null;
  private currPage: Component | null = null;
  private currLayoutClass: ComponentConstructor | null = null;
  private notFoundClass: ComponentConstructor | null = null;

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
    const paramNames: string[] = [];
    const regexStr = hash.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return `([^/]+)`;
    });
    const regex = new RegExp(`^${regexStr}$`);
    this.routes.push({ regex, paramNames, pageClass });
  }

  public addLayout(prefix: string, layoutClass: ComponentConstructor): void {
    this.layouts.push({ prefix, layoutClass });
    this.layouts.sort((a, b) => b.prefix.length - a.prefix.length);
  }

  public setNotFound(pageClass: ComponentConstructor): void {
    this.notFoundClass = pageClass;
  }

  private handleRoute(): void {
    const hash = window.location.hash.slice(1) || '/';
    const params: Record<string, any> = {};
    let PageClass: ComponentConstructor | null = null;

    for (const route of this.routes) {
      const match = hash.match(route.regex);

      if (match) {
        PageClass = route.pageClass;

        route.paramNames?.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        break;
      }
    }

    if (!PageClass) {
      PageClass = this.notFoundClass;
      if (!PageClass) {
        throw new Error(
          `Не найден pageClass для маршрута "${hash}" и не зарегистрирован 404`,
        );
      }
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

    this.currPage = new PageClass(params);
    this.currPage.mount(outlet);

    this.listeners.forEach((l) => l(hash, params));
  }

  public onRouterChange(listiner: RouterChangeListiner) {
    this.listeners.push(listiner);

    const hash = window.location.hash.slice(1) || '';
    listiner(hash, {});
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listiner);
    };
  }

  public navigate(hash: string): void {
    window.location.hash = hash;
  }
}

export const router = new HashRouter('app');
