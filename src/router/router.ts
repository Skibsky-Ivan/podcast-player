import { Component } from '../core/component.ts';

type PageConstructor = new () => Component;

export class HashRouter {
  routes: Record<string, PageConstructor> = {};
  outlet: HTMLElement;
  currentPage: Component | null = null;

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;

    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  public addRoute(hash: string, pageClass: PageConstructor): void {
    this.routes[hash] = pageClass;
  }

  private handleRoute(): void {
    const hash = window.location.hash.slice(1) || '/';
    const PageClass = this.routes[hash] || this.routes['/404'];

    if (this.currentPage) {
      this.currentPage.unmount();
      this.currentPage = null;
    }

    if (PageClass) {
      this.currentPage = new PageClass();
      this.currentPage.mount(this.outlet);
    }
  }

  public navigate(hash: string): void {
    window.location.hash = hash;
  }
}
