class Dom {
  constructor(selector) {
    // #app
    this.$el = typeof selector === 'string' 
      ? document.querySelector(selector)
      : selector;
  }

  html(html) {
    if (typeof html === 'string') {
      this.$el.innerHTML = html;

      return this;
    }

    return this.$el.outerHTML.trim();
  }

  clear() {
    this.html('');

    return this;
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.$el;
    }

    if (Element.prototype.append) {
      this.$el.append(node);
    } else {
      this.$el.appendChild(node);
    }

    return this;
  }

  on(eventType, callback) {
    this.$el.addEventListener(eventType, callback);
  }

  off(eventType, callback) {
    this.$el.removeEventListener(eventType, callback);
  }

  css(styles = {}) {
    // for (let cssKey in styles) {
    //   if (styles.hasOwnProperty(cssKey)) {
    //     this.$el.style[cssKey] = styles[cssKey];
    //   }
    // }

    Object
      .keys(styles)
      .forEach(key => {
        this.$el.style[key] = styles[key];
      });

    return this;
  }

  get data() {
    return this.$el.dataset;
  }

  findAll(selector) {
    return this.$el.querySelectorAll(selector);
  }

  closest(selector) {
    return $(this.$el.closest(selector));
  }

  addClass(className) {
    const classes = className.split(' ');

    for (let i = 0; i < classes.length; i++) {
      this.$el.classList.add(classes[i]);
    }

    return this;
  }

  removeClass(className) {
    const classes = className.split(' ');

    for (let i = 0; i < classes.length; i++) {
      this.$el.classList.remove(classes[i]);
    }

    return this;
  }

  getCoords() {
    return this.$el.getBoundingClientRect();
  }
}

// event.target
export function $(selector) {
  return new Dom(selector);
}

$.create = (tagName, classes = '') => {
  const el = document.createElement(tagName);

  if (classes) {
    el.classList.add(classes);
  }

  return $(el);
};
