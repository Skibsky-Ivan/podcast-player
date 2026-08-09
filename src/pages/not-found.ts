import { Component } from '../core/component.ts';

export class NotFoundPage extends Component {
  render(): string {
    return `
      <div class="container not-found">
        <h1>404 - Страница не найдена</h1>
        <p>Запрошенный адрес не существует.</p>
        <a href="/" class="btn" data-link>Вернуться на главную</a>
      </div>
    `;
  }
}
