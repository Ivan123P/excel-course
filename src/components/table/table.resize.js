import { $ } from "@/core/dom";

export function resizeHandle($root, event) {
  const $resizer = $(event.target);
  // const $parent = $resizer.$el.parentNode; // BAD!!!
  // const $parent = $resizer.$el.closest('.column'); // better but bad!!!
  const $parent = $resizer.closest('[data-type="resizable"]');
  const coordsParent = $parent.getCoords();
  const direction = $resizer.data.resize;

  let delta = 0,
      value = 0;

  $resizer.addClass('is_active');

  document.onmousemove = e => {
    if (direction === 'col') {
      delta = e.pageX - coordsParent.right;
      value = coordsParent.width + delta;

      $resizer.css({right: -delta + 'px'});
    } else {
      delta = e.pageY - coordsParent.bottom;
      value = coordsParent.height + delta;

      $resizer.css({bottom: -delta + 'px'});
    }
  }

  document.onmouseup = () => {
    if (direction === 'col') {
      $resizer.css({right: 0});
      $parent.css({width: value + 'px'});
      $root.findAll(`[data-col="${$parent.data.col}"]`) // getter из dom
        .forEach(el => {
          $(el).css({width: value + 'px'});
        });

    } else {
      $resizer.css({bottom: 0});
      $parent.css({height: value + 'px'});
    }

    $resizer.removeClass('is_active');

    document.onmousemove = null;
    document.onmouseup = null;
  }
}