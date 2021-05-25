import { Table } from "@/components/table/Table";
import { defaultStyles } from "@/constants";
import { toInlineStyles } from "@/core/utils";
import { parse } from "@core/parse";

// function toCell(_, col) {
//   return `<div class="cell" data-col="${col}" contenteditable></div>`;
// }

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 24;

function getWidth(state, index) {
  return `${state[index] || DEFAULT_WIDTH}px`
}

function getHeight(state, index) {
  return `${state[index] || DEFAULT_HEIGHT}px`
}

function toCell(state, row) {
  return function(_, col) {
    const width = getWidth(state.colState, col);
    const id = `${row}:${col}`;
    const data = state.dataState[id];
    const styles = toInlineStyles({
      ...defaultStyles,
      ...state.stylesState[id]
    });
    // 'font-weight:bold;text-decoration:underline;'

    return `
      <div 
        class="cell" 
        data-id="${id}" 
        data-type="cell" 
        data-col="${col}" 
        data-value="${data || ''}" 
        style="${styles};width:${width};"
        contenteditable>${parse(data) || ''}</div>
      `;
  }
}

function toColumn({col, index, width}) {
  return `
    <div class="column" data-type="resizable" data-col="${index}" style="width: ${width};">
      ${col}
      <div class="column-resize" data-resize="col"></div>
    </div>
  `;
}

function createRow(row, content, state) {
  const resizer = row ? `<div class="row-resize" data-resize="row"></div>` : '';
  const height = getHeight(state, row);

  return `
    <div class="row" data-type="resizable" data-row="${row}" style="height: ${height};">
      <div class="row-info">
        ${row ? row : ' '}
        ${resizer}
      </div>
      <div class="row-data">${content}</div>
    </div>
  `;
}

function toChar(_, index) {
  return String.fromCharCode(Table.CODES.A + index);
}

function withWidthFrom(state) {
  return function(col, index) {
    return {
      col, index, width: getWidth(state.colState, index)
    }
  }
}

export function createTable(rowsCount = 15, state = {}) {
  const colsCount = Table.CODES.Z - Table.CODES.A + 1;
  const rows = [];

  const cols = new Array(colsCount)
    .fill('')
    .map(toChar)
    .map(withWidthFrom(state))
    .map(toColumn)
    .join('');

  rows.push(createRow(null, cols, {}));

  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
      .fill('')
      // .map(toCell)
      .map(toCell(state, row))
      .join('');

    rows.push(createRow(row + 1, cells, state.rowState));
  }

  return rows.join('');
}