import { elementUpdated, expect, fixture, fixtureCleanup, html } from '@open-wc/testing';
import { MutationObserverElement } from '../src/mutation-observer.js';

describe('<mutation-observer> upgrading', () => {
  it('default properties', async () => {
    const el = await fixture(html`<mutation-observer></mutation-observer>`);

    // Update properties before upgrading
    el.attr = '*';
    el.attrOldValue = true;
    el.childList = true;
    el.charData = true;
    el.charDataOldValue = true;

    // Upgrade custom element
    MutationObserverElement.defineCustomElement();

    await elementUpdated(el);

    expect(el.getAttribute('attr')).to.equal('*');
    expect(el.getAttribute('attr-old-value')).to.equal('');
    expect(el.getAttribute('child-list')).to.equal('');
    expect(el.getAttribute('char-data')).to.equal('');
    expect(el.getAttribute('char-data-old-value')).to.equal('');
  });

  afterEach(() => {
    fixtureCleanup();
  });
});
