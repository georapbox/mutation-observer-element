// @ts-check

const styles = /* css */ `
  :host {
    display: contents;
  }
`;

const template = document.createElement('template');

template.innerHTML = /* html */ `
  <style>${styles}</style>
  <slot></slot>
`;

/**
 * A custom element that offers a declarative interface to the MutationObserver API.
 *
 * @documentation https://github.com/georapbox/mutation-observer-element
 *
 * @tagname mutation-observer
 * @extends HTMLElement
 *
 * @slot - Contains the target nodes to observe for mutations.
 *
 * @event mutation-observer-change - Dispatched when a mutation is observed.
 */
export class MutationObserverElement extends HTMLElement {
  /** @type {boolean} */
  #connected = false;

  /** @type {MutationObserver | null} */
  #mutationObserver = null;

  constructor() {
    super();

    let shadowRoot = this.shadowRoot;

    if (!shadowRoot) {
      shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ['attr', 'attr-old-value', 'char-data', 'char-data-old-value', 'child-list', 'disabled'];
  }

  /**
   * Lifecycle method that is called when attributes are changed, added, removed, or replaced.
   *
   * @param {string} name - The name of the attribute.
   * @param {string | null} oldValue - The old value of the attribute.
   * @param {string | null} newValue - The new value of the attribute.
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
   * Specifies a space-separated list of attribute names to observe.
   * Use "*" to observe all attributes.
   *
   * @type {string}
   * @attribute attr
   * @reflect
   * @default ''
   */
  get attr() {
    return this.getAttribute('attr') || '';
  }

  set attr(value) {
    this.setAttribute('attr', value);
  }

  /**
   * Records the previous values of observed attributes when enabled.
   *
   * @type {boolean}
   * @attribute attr-old-value
   * @reflect
   * @default false
   */
  get attrOldValue() {
    return this.hasAttribute('attr-old-value');
  }

  set attrOldValue(value) {
    this.toggleAttribute('attr-old-value', !!value);
  }

  /**
   * Observes changes to character data, such as text content, when enabled.
   *
   * @type {boolean}
   * @attribute char-data
   * @reflect
   * @default false
   */
  get charData() {
    return this.hasAttribute('char-data');
  }

  set charData(value) {
    this.toggleAttribute('char-data', !!value);
  }

  /**
   * Records the previous values of observed character data when enabled.
   *
   * @type {boolean}
   * @attribute char-data-old-value
   * @reflect
   * @default false
   */
  get charDataOldValue() {
    return this.hasAttribute('char-data-old-value');
  }

  set charDataOldValue(value) {
    this.toggleAttribute('char-data-old-value', !!value);
  }

  /**
   * Observes additions and removals of child nodes when enabled.
   *
   * @type {boolean}
   * @attribute child-list
   * @reflect
   * @default false
   */
  get childList() {
    return this.hasAttribute('child-list');
  }

  set childList(value) {
    this.toggleAttribute('child-list', !!value);
  }

  /**
   * Disables mutation observation when enabled.
   *
   * @type {boolean}
   * @attribute disabled
   * @reflect
   * @default false
   */
  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    this.toggleAttribute('disabled', !!value);
  }

  /**
   * Lifecycle method that is called when the element is added to the DOM.
   */
  connectedCallback() {
    this.#upgradeProperty('attr');
    this.#upgradeProperty('attrOldValue');
    this.#upgradeProperty('charData');
    this.#upgradeProperty('charDataOldValue');
    this.#upgradeProperty('childList');
    this.#upgradeProperty('disabled');

    this.#connected = true;

    if (typeof MutationObserver === 'function') {
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
   * Lifecycle method that is called when the element is moved to a different
   * place in the DOM via `Element.moveBefore()`.
   *
   * Preserves the active MutationObserver during state-preserving moves.
   */
  connectedMoveCallback() {}

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
   * Handles mutations observed by the MutationObserver.
   *
   * @param {MutationRecord[]} mutations - The observed mutations.
   */
  #handleMutation = mutations => {
    this.#emit('mutation-observer-change', { mutations });
  };

  /**
   * Dispatches an event, using CustomEvent when detail is provided.
   *
   * @template T
   * @param {string} type - The event type.
   * @param {T} [detail] - Optional event detail.
   * @param {{ cancelable?: boolean }} [options] - Event options.
   * @returns {boolean} Whether the event was not canceled.
   */
  #emit(type, detail, { cancelable = false } = {}) {
    const options = { bubbles: true, composed: true, cancelable };
    const event = detail === undefined ? new Event(type, options) : new CustomEvent(type, { ...options, detail });
    return this.dispatchEvent(event);
  }

  /**
   * Re-applies a property value that may have been set on the element
   * instance before the custom element was defined.
   *
   * This handles cases where a framework sets a property on the element
   * before its definition is loaded. Without this step, the own property
   * on the instance would shadow the class setter and prevent it from
   * running after upgrade.
   *
   * @see https://web.dev/articles/custom-elements-best-practices#make_properties_lazy
   *
   * @param { 'attr' | 'attrOldValue' | 'charData' | 'charDataOldValue' | 'childList' | 'disabled'} prop - The property name to upgrade.
   */
  #upgradeProperty(prop) {
    const instance = /** @type {HTMLElement & Record<string, unknown>} */ (this);

    if (Object.hasOwn(instance, prop)) {
      const value = instance[prop];
      delete instance[prop];
      instance[prop] = value;
    }
  }

  /**
   * Registers the custom element in the specified registry, unless already defined.
   *
   * @param {{ prefix?: string, registry?: CustomElementRegistry }} [options] - Registration options.
   */
  static define(options = {}) {
    const { prefix = '', registry = globalThis.customElements } = options;

    if (!registry) {
      return;
    }

    const tagName = prefix ? `${prefix}-mutation-observer` : 'mutation-observer';

    if (!registry.get(tagName)) {
      registry.define(tagName, this);
    }
  }
}
