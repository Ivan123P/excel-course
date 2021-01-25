import { ExcelComponent } from "@/core/ExcelComponent";
import { createTable } from "@/components/table/table.template";
import { resizeHandle } from "@/components/table/table.resize";
import { shouldResize } from "@/components/table/table.functions";

export class Table extends ExcelComponent {
  static className = 'excel__table';

  constructor($root) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown']
    })
  }

  toHTML() {
    return createTable(20);
  }

  // onClick(event) {
  //   console.log('Table: onClick', event.target);
  // }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandle(this.$root, event);
    }
  }

  // onMouseup(event) {}
}
