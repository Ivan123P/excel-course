import { Table } from "@/components/table/Table";

// function toCell(_, col) {
//   return `<div class="cell" data-col="${col}" contenteditable></div>`;
// }

function toCell(row) {
  return function(_, col) {
    return `
      <div 
        class="cell" 
        data-id="${row}:${col}" 
        data-type="cell" 
        data-col="${col}" 
        contenteditable></div>
      `;
  }
}

function toColumn(col, index) {
  return `
    <div class="column" data-type="resizable" data-col="${index}">
      ${col}
      <div class="column-resize" data-resize="col"></div>
    </div>
  `;
}

function createRow(index, content) {
  const resizer = index ? `<div class="row-resize" data-resize="row"></div>` : '';
  return `
    <div class="row" data-type="resizable">
      <div class="row-info">
        ${index ? index : ' '}
        ${resizer}
      </div>
      <div class="row-data">${content}</div>
    </div>
  `;
}

function toChar(_, index) {
  return String.fromCharCode(Table.CODES.A + index);
}

export function createTable(rowsCount = 15) {
  const colsCount = Table.CODES.Z - Table.CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
    .fill('')
    .map(toChar)
    .map(toColumn)
    .join('');

  rows.push(createRow(null, cols));

  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
      .fill('')
      // .map(toCell)
      .map(toCell(row))
      .join('');

    rows.push(createRow(row + 1, cells));
  }

  return rows.join('');
}