import { isCell, matrix, nextSelector, shouldResize } from "@/components/table/table.functions";
import { resizeHandle } from "@/components/table/table.resize";
import { createTable } from "@/components/table/table.template";
import { TableSelection } from "@/components/table/TableSelection";
import { ExcelComponent } from "@/core/ExcelComponent";
import * as actions from '@/redux/actions';
import { $ } from "@core/dom";
import { defaultStyles } from "@/constants";
import { parse } from "@core/parse";

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
    return createTable(Table.tableRow, this.store.getState());
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();

    const $cell = this.$root.find('[data-id="0:0"]');

    this.selectCell($cell);

    this.$on('formula:input', value => {
      this.selection.current
        .attr('data-value', value)
        .text(parse(value));
      this.updateTextInStore(value);
    })

    this.$on('formula:done', () => {
      this.selection.current.focus();
    })

    this.$on('toolbar:applyStyle', (value) => {
      this.selection.applyStyle(value);
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds
      }));
    });
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyles));
    this.$dispatch(actions.changeStyles(styles));
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandle(this.$root, event);
      this.$dispatch(actions.tableResize(data))
    } catch (e) {
      console.warn('Resize error', e.message)
    }
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event);
    } else if (isCell(event)) {
      const $target = $(event.target);

      if (event.shiftKey) {
        const cells = matrix($target, this.selection.current)
          .map(id => this.$root.find(`[data-id="${id}"]`));

        this.selection.selectGroup(cells);
      } else {
        this.selectCell($target);
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

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }));
  }

  onInput(event) {
    // this.$emit('table:input', $(event.target).text());
    this.updateTextInStore($(event.target).text());
  }
}
