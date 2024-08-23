// @ts-check

/**
 * Represents a value that may be of type T, or null.
 *
 * @template T
 * @typedef {T | null} Nullable
 */

const styles = /* css */ `:host { display: contents; }`;
const template = document.createElement('template');

template.innerHTML = /* html */ `
  <style>${styles}</style>
  <slot></slot>
`;

/**
 * @summary A custom element that offers a declarative interface to the MutationObserver API.
 * @documentation https://github.com/georapbox/mutation-observer-element#readme
 *
 * @tagname mutation-observer - This is the default tag name, unless overridden by the `defineCustomElement` method.
 *
 * @property {string} attr - A space-separated string of attribute names to monitor (e.g., "title class href"). Use "*" to monitor all attributes.
 * @property {boolean} attrOldValue - Set to true to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes.
 * @property {boolean} childList - Set to true to monitor the target node for the addition of new child nodes or removal of existing child nodes.
 * @property {boolean} charData - Set to true to monitor the specified target node for changes to the character data contained within the node or nodes.
 * @property {boolean} charDataOldValue - Set to true to record the previous value of a node's text whenever the text changes on nodes being monitored.
 * @property {boolean} disabled - Set to true to stop monitoring for mutations.
 *
 * @attribute {string} attr - Reflects the attr property.
 * @attribute {boolean} attr-old-value - Reflects the attrOldValue property.
 * @attribute {boolean} child-list - Reflects the childList property.
 * @attribute {boolean} char-data - Reflects the charData property.
 * @attribute {boolean} char-data-old-value - Reflects the charDataOldValue property.
 * @attribute {boolean} disabled - Reflects the disabled property.
 *
 * @slot - The default slot where the target node or nodes to be monitored are placed.
 *
 * @event mutation-observer:mutate - Dispatched when a mutation is observed.
 *
 * @method defineCustomElement - Static method. Defines the custom element with the given name.
 */
class MutationObserverElement extends HTMLElement {
  /** @type {boolean} */
  #connected = false;

  /** @type {Nullable<MutationObserver>} */
  #mutationObserver = null;

  constructor() {
    super();

    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ['attr', 'attr-old-value', 'child-list', 'char-data', 'char-data-old-value', 'disabled'];
  }

  /**
   * Lifecycle method that is called when attributes are changed, added, removed, or replaced.
   *
   * @param {string} name - The name of the attribute.
   * @param {string} oldValue - The old value of the attribute.
   * @param {string} newValue - The new value of the attribute.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'disabled' && oldValue !== newValue && this.#connected) {
      this.disabled ? this.#stopObserver() : this.#startObserver();
    }

    const shouldRestartObserver =
      (name === 'attr' ||
        name === 'attr-old-value' ||
        name === 'char-data' ||
        name === 'char-data-old-value' ||
        name === 'child-list') &&
      oldValue !== newValue &&
      this.#connected;

    if (shouldRestartObserver) {
      this.#stopObserver();
      this.#startObserver();
    }
  }

  /**
   * Lifecycle method that is called when the element is added to the DOM.
   */
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

  /**
   * Lifecycle method that is called when the element is removed from the DOM.
   */
  disconnectedCallback() {
    this.#connected = false;
    this.#stopObserver();
  }

  /**
   * @type {boolean} - Whether the element is disabled.
   * @default false
   * @attribute disabled - Reflects the disabled property.
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    this.toggleAttribute('disabled', !!value);
  }

  /**
   * @type {string} - A space-separated string of attribute names to monitor (e.g., "title class href"). Use "*" to monitor all attributes.
   * @default ''
   * @attribute attr - Reflects the attr property.
   */
  get attr() {
    return this.getAttribute('attr') || '';
  }

  set attr(value) {
    this.setAttribute('attr', value);
  }

  /**
   * @type {boolean} - Set to true to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes.
   * @default false
   * @attribute attr-old-value - Reflects the attrOldValue property.
   */
  get attrOldValue() {
    return this.hasAttribute('attr-old-value');
  }

  set attrOldValue(value) {
    this.toggleAttribute('attr-old-value', !!value);
  }

  /**
   * @type {boolean} - Set to true to monitor the specified target node for changes to the character data contained within the node or nodes.
   * @default false
   * @attribute char-data - Reflects the charData property.
   */
  get charData() {
    return this.hasAttribute('char-data');
  }

  set charData(value) {
    this.toggleAttribute('char-data', !!value);
  }

  /**
   * @type {boolean} - Set to true to record the previous value of a node's text whenever the text changes on nodes being monitored.
   * @default false
   * @attribute char-data-old-value - Reflects the charDataOldValue property.
   */
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

  /**
   * @type {boolean} - Set to true to monitor the target node for the addition of new child nodes or removal of existing child nodes.
   * @default false
   * @attribute child-list - Reflects the childList property.
   */
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

  /**
   * Starts observing the element for mutations.
   */
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

  /**
   * Stops observing the element for mutations.
   */
  #stopObserver() {
    this.#mutationObserver && this.#mutationObserver.disconnect();
  }

  /**
   * Handles the mutation observer's mutation list.
   *
   * @param {MutationRecord[]} mutationList - The list of mutations observed.
   */
  #handleMutation = mutationList => {
    this.dispatchEvent(
      new CustomEvent('mutation-observer:mutate', {
        bubbles: true,
        composed: true,
        detail: { mutationList }
      })
    );
  };

  /**
   * This is to safe guard against cases where, for instance, a framework may have added the element to the page and set a
   * value on one of its properties, but lazy loaded its definition. Without this guard, the upgraded element would miss that
   * property and the instance property would prevent the class property setter from ever being called.
   *
   * https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
   *
   * @param { 'attr' | 'attrOldValue' | 'childList' | 'charData' | 'charDataOldValue' | 'disabled'} prop - The property name to upgrade.
   */
  #upgradeProperty(prop) {
    /** @type {any} */
    const instance = this;

    if (Object.prototype.hasOwnProperty.call(instance, prop)) {
      const value = instance[prop];
      delete instance[prop];
      instance[prop] = value;
    }
  }

  /**
   * Defines a custom element with the given name.
   * The name must contain a dash (-).
   *
   * @param {string} [elementName='mutation-observer'] - The name of the custom element.
   * @example
   *
   * MutationObserverElement.defineCustomElement('my-mutation-observer');
   */
  static defineCustomElement(elementName = 'mutation-observer') {
    if (typeof window !== 'undefined' && !window.customElements.get(elementName)) {
      window.customElements.define(elementName, MutationObserverElement);
    }
  }
}

export { MutationObserverElement };
