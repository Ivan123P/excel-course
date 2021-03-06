export class TableSelection {
  static className = 'selected';

  constructor() {
    this.group = [];
    this.current = null;
  }

  select($el) {
    this.unselect();
    this.current = $el;
    this.group.push($el);
    $el.focus().addClass(TableSelection.className);
  }

  unselect() {
    this.group.forEach($el => $el.removeClass(TableSelection.className));
    this.group = [];
  }

  get selectedIds() {
    return this.group.map($element => $element.id())
  }

  selectGroup($group = []) {
    this.unselect();
    this.group = $group;
    this.group.forEach($el => $el.addClass(TableSelection.className));
  }

  applyStyle(style) {
    this.group.forEach($el => $el.css(style));
  }
}