const template = document.createElement('template');

template.innerHTML = /* html */`
  <style>:host { display: contents; }</style>
  <slot></slot>
`;

class MutationObserverElement extends HTMLElement {
  #connected;
  #mutationObserver;

  constructor() {
    super();

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ['disabled', 'attr', 'attr-old-value', 'char-data', 'char-data-old-value', 'child-list'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && oldValue !== newValue && this.#connected) {
      this.disabled ? this.#stopObserver() : this.#startObserver();
    }

    const shouldRestartObserver = (
      name === 'attr'
      || name === 'attr-old-value'
      || name === 'char-data'
      || name === 'char-data-old-value'
      || name === 'child-list'
    ) && oldValue !== newValue && this.#connected;

    if (shouldRestartObserver) {
      this.#stopObserver();
      this.#startObserver();
    }
  }

  connectedCallback() {
    this.#upgradeProperty('disabled');
    this.#upgradeProperty('attr');
    this.#upgradeProperty('attrOldValue');
    this.#upgradeProperty('charData');
    this.#upgradeProperty('charDataOldValue');
    this.#upgradeProperty('childList');

    this.#connected = true;

    if ('MutationObserver' in window) {
      this.#mutationObserver = new MutationObserver(this.#handleMutation);

      if (!this.disabled) {
        this.#startObserver();
      }
    }
  }

  disconnectedCallback() {
    this.#connected = false;
    this.#stopObserver();
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get attr() {
    return this.getAttribute('attr');
  }

  set attr(value) {
    this.setAttribute('attr', value);
  }

  get attrOldValue() {
    return this.hasAttribute('attr-old-value');
  }

  set attrOldValue(value) {
    if (value) {
      this.setAttribute('attr-old-value', '');
    } else {
      this.removeAttribute('attr-old-value');
    }
  }

  get charData() {
    return this.hasAttribute('char-data');
  }

  set charData(value) {
    if (value) {
      this.setAttribute('char-data', '');
    } else {
      this.removeAttribute('char-data');
    }
  }

  get charDataOldValue() {
    return this.hasAttribute('char-data-old-value');
  }

  set charDataOldValue(value) {
    if (value) {
      this.setAttribute('char-data-old-value', '');
    } else {
      this.removeAttribute('char-data-old-value');
    }
  }

  get childList() {
    return this.hasAttribute('child-list');
  }

  set childList(value) {
    if (value) {
      this.setAttribute('child-list', '');
    } else {
      this.removeAttribute('child-list');
    }
  }

  #startObserver() {
    if (!this.#mutationObserver) {
      return;
    }

    const hasObservedAttributes = typeof this.attr === 'string' && this.attr.length > 0;

    try {
      this.#mutationObserver.observe(this, {
        subtree: true,
        attributes: hasObservedAttributes,
        attributeOldValue: this.attrOldValue,
        attributeFilter: hasObservedAttributes && this.attr !== '*' ? this.attr.split(' ') : void 0,
        childList: this.childList,
        characterData: this.charData,
        characterDataOldValue: this.charDataOldValue
      });
    } catch {
      // Suppress any errors thrown if any of the required attributes
      // `attr`, `child-list`, `char-data` are missing.
    }
  }

  #stopObserver() {
    this.#mutationObserver && this.#mutationObserver.disconnect();
  }

  #handleMutation = mutationList => {
    this.dispatchEvent(new CustomEvent('mutation-observer:mutate', {
      bubbles: true,
      composed: true,
      detail: { mutationList }
    }));
  };

  #upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  static defineCustomElement(elementName = 'mutation-observer') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, MutationObserverElement);
    }
  }
}

export { MutationObserverElement };
