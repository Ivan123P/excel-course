import { range } from "@core/utils";

export function shouldResize(event) {
  return event.target.dataset.resize;
}

export function isCell(event) {
  return event.target.dataset.type === 'cell';
}

export function matrix($target, $current) {
  const target = $target.id(true);
  const current = $current.id(true);

  const cols = range(current.col, target.col);
  const rows = range(current.row, target.row);

  return cols.reduce((acc, col) => {
    rows.forEach(row => acc.push(`${row}:${col}`))
    return acc;
  }, []);
}

export function nextSelector(key, {col, row}, [_MAX_RIGHT, _MAX_DOWN]) {
  const MIN_VALUE = 0;
  const MAX_RIGHT = _MAX_RIGHT;
  const MAX_DOWN = _MAX_DOWN;

  switch (key) {
    case 'Enter' :
    case 'ArrowDown' :
      row = row + 1 > MAX_DOWN ? MAX_DOWN : row + 1;
      break;
    case 'Tab' :
    case 'ArrowRight' :
      col = col + 1 > MAX_RIGHT ? MAX_RIGHT : col + 1;
      break;
    case 'ArrowLeft' :
      col = col - 1 < MIN_VALUE ? MIN_VALUE : col - 1;
      break;
    case 'ArrowUp' :
      row = row - 1 < MIN_VALUE ? MIN_VALUE : row - 1;
      break;
  }

  return `[data-id="${row}:${col}"]`;
}