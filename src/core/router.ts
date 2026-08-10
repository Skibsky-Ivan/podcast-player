import { Component } from './component.ts';

type ComponentConstructor = new (props?: any) => Component;
type RouterChangeListener = (path: string, param: Record<string, any>) => void;

interface LayoutRule {
  prefix: string;
  layoutClass: ComponentConstructor;
}

interface RouterRule {
  path: string;
  regex: RegExp;
  paramNames: string[] | null;
  pageClass: ComponentConstructor;
}

class HistoryRouter {
  private routes: RouterRule[] = [];
  private layouts: LayoutRule[] = [];
  private rootElement: HTMLElement;
  private listeners: RouterChangeListener[] = [];

  private currLayout: Component | null = null;
  private currPage: Component | null = null;
  private currLayoutClass: ComponentConstructor | null = null;

  constructor(rootElementId: string) {
    const element = document.getElementById(rootElementId);
    if (!element) {
      throw new Error(`Контейнер с id "${rootElementId}" не найден в DOM!`);
    }

    this.rootElement = element;

    window.addEventListener('popstate', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[data-link]');

      if (anchor) {
        const href = anchor.getAttribute('href');
        if (!href) return;

        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return;

        e.preventDefault();
        this.navigate(url.pathname + url.search + url.hash);
      }
    });
  }

  public addRoute(path: string, pageClass: ComponentConstructor): void {
    const paramNames: string[] = [];
    const regexStr = path.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return `([^/]+)`;
    });
    const regex = new RegExp(`^${regexStr}$`);
    this.routes.push({ path, regex, paramNames, pageClass });
  }

  public addLayout(prefix: string, layoutClass: ComponentConstructor): void {
    this.layouts.push({ prefix, layoutClass });
    this.layouts.sort((a, b) => b.prefix.length - a.prefix.length);
  }

  private matchRoute(
    path: string,
  ): { route: RouterRule; params: Record<string, any> } | null {
    for (const route of this.routes) {
      const match = path.match(route.regex);
      if (match) {
        const params: Record<string, any> = {};
        route.paramNames?.forEach((name, i) => {
          params[name] = match[i + 1];
        });
        return { route, params };
      }
    }
    return null;
  }

  private resolvePageClass(path: string): {
    PageClass: ComponentConstructor;
    params: Record<string, any>;
  } {
    const matched = this.matchRoute(path);

    if (matched) {
      return { PageClass: matched.route.pageClass, params: matched.params };
    }

    const notFound = this.routes.find((r) => r.path === '/404');
    if (notFound) {
      return { PageClass: notFound.pageClass, params: {} };
    }

    throw new Error(
      `Не найден pageClass для маршрута "${path}" и не зарегистрирован /404`,
    );
  }

  private resolveLayout(path: string): ComponentConstructor {
    const matchedLayout = this.layouts.find((rule) =>
      path.startsWith(rule.prefix),
    );
    if (!matchedLayout) {
      throw new Error(`Не найден layoutClass для префикса пути "${path}"`);
    }
    return matchedLayout.layoutClass;
  }

  private switchLayout(TargetLayoutClass: ComponentConstructor): void {
    if (this.currLayoutClass === TargetLayoutClass) return;

    this.currLayout?.unmount();
    this.currLayout = new TargetLayoutClass();
    this.currLayout.mount(this.rootElement);
    this.currLayoutClass = TargetLayoutClass;
  }

  private renderPage(
    PageClass: ComponentConstructor,
    params: Record<string, any>,
  ): void {
    if (this.currPage) {
      this.currPage.unmount();
      this.currPage = null;
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
  }

  private handleRoute(): void {
    const path = window.location.pathname;
    const { PageClass, params } = this.resolvePageClass(path);
    const TargetLayoutClass = this.resolveLayout(path);

    this.switchLayout(TargetLayoutClass);
    this.renderPage(PageClass, params);

    this.listeners.forEach((l) => l(path, params));
  }

  public onRouterChange(listener: RouterChangeListener) {
    this.listeners.push(listener);

    const path = window.location.pathname;
    listener(path, {});
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public navigate(path: string): void {
    const current =
      window.location.pathname + window.location.search + window.location.hash;
    if (current === path) return;

    window.history.pushState({}, '', path);
    this.handleRoute();
  }
}

export const router = new HistoryRouter('app');
