import { DomListener } from '@core/DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || '';
    this.emitter = options.emitter;
    this.unsubs = [];

    this.prepare();
  }

  // настраиваем компонент до инит
  prepare() {}

  // Возвращает шаблон компонента
  toHTML() {
    return '';
  }

  // уведомляем слушателей про событие event
  $emit(event, ...args) {
    this.emitter.emit(event, ...args);
  }

  // подписываемся на событие event
  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn);
    this.unsubs.push(unsub);
  }

  //инициализируем компонент, добавляем дом слушателей
  init() {
    this.initDomListeners();
  }

  // удаляем компонент
  // чистим слушателей
  destroy() {
    this.removeDomListeners();
    this.unsubs.forEach(unsub => unsub());
  }
}
