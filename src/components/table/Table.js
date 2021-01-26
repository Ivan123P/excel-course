import { resizeHandle } from "@/components/table/table.resize";
import { createTable } from "@/components/table/table.template";
import { TableSelection } from "@/components/table/TableSelection";
import { ExcelComponent } from "@/core/ExcelComponent";
import { $ } from "@core/dom";
import { isCell, matrix, nextSelector, shouldResize } from "./table.functions";

export class Table extends ExcelComponent {
  static className = 'excel__table';
  static tableRow = 20;
  // для красивого оперирования цифра без "магических цифр". т.е в коде будет CODES.A вместо  непонятного - 65
  static CODES = {
    A: 65,
    Z: 90
  }

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'click', 'input'],
      ...options,
    })
  }

  toHTML() {
    return createTable(Table.tableRow);
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();

    const $cell = this.$root.find('[data-id="0:0"]');

    this.selectCell($cell);

    this.$on('formula:input', text => {
      this.selection.current.text(text);
    })

    this.$on('formula:done', () => {
      this.selection.current.focus();
    })
  }

  selectCell(_cell) {
    this.selection.select(_cell);
    this.$emit('table:select', _cell.text());
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandle(this.$root, event);
    } else if (isCell(event)) {
      const $target = $(event.target);

      if (event.shiftKey) {
        const cells = matrix($target, this.selection.current)
          .map(id => this.$root.find(`[data-id="${id}"]`));

        this.selection.selectGroup(cells);
      } else {
        this.selection.select($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      'Enter',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp'];

    const {key} = event;

    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();

      const id = this.selection.current.id(true);
      const MAX_RIGHT = Table.CODES.Z - Table.CODES.A;
      const MAX_DOWN = Table.tableRow - 1;

      const $next = this.$root.find(nextSelector(key, id, [MAX_RIGHT, MAX_DOWN]));

      this.selectCell($next);
    }
  }

  onClick(event) {
    this.$emit('table:click', $(event.target).text());
  }

  onInput(event) {
    this.$emit('table:input', $(event.target).text());
  }
}
