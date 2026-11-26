import { expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { MutationObserverElement } from '../src/mutation-observer.js';

describe('mutation-observer upgrading', () => {
  afterEach(() => {
    fixtureCleanup();
  });

  it('should preserve properties set before the custom element is defined', async () => {
    const container = await fixture(html`<div></div>`);
    const el = document.createElement('mutation-observer');

    // Set properties before upgrading
    el.attr = '*';
    el.attrOldValue = true;
    el.childList = true;
    el.charData = true;
    el.charDataOldValue = true;
    el.paused = true;

    // Define and explicitly upgrade the custom element
    MutationObserverElement.define();
    customElements.upgrade(el);

    // Connect the element so connectedCallback runs
    container.appendChild(el);

    expect(el.getAttribute('attr')).to.equal('*');
    expect(el.getAttribute('attr-old-value')).to.equal('');
    expect(el.getAttribute('child-list')).to.equal('');
    expect(el.getAttribute('char-data')).to.equal('');
    expect(el.getAttribute('char-data-old-value')).to.equal('');
    expect(el.getAttribute('paused')).to.equal('');
  });
});
