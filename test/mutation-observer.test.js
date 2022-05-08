import { elementUpdated, expect, fixture, fixtureCleanup, html, aTimeout, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import { MutationObserverElement } from '../src/mutation-observer.js';

MutationObserverElement.defineCustomElement();

describe('<mutation-observer>', () => {
  it('passes accessibility test', async () => {
    const el = await fixture(html`<mutation-observer></mutation-observer>`);
    await expect(el).to.be.accessible();
  });

  it('default properties', async () => {
    const el = await fixture(html`<mutation-observer></mutation-observer>`);

    expect(el.disabled).to.be.false;
    expect(el.getAttribute('disabled')).to.be.null;
  });

  it('change default properties', async () => {
    const el = await fixture(html`<mutation-observer disabled></mutation-observer>`);

    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.equal('');
  });

  it('change properties programmatically', async () => {
    const el = await fixture(html`<mutation-observer></mutation-observer>`);

    el.disabled = true;

    await elementUpdated(el);

    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.equal('');

    // toggle properties
    el.disabled = false;

    await elementUpdated(el);

    expect(el.disabled).to.be.false;
    expect(el.getAttribute('disabled')).to.be.null;
  });

  it('observe attributes change: class', async () => {
    const el = await fixture(html`
      <mutation-observer attr="class">
        <button type="button" class="btn-primary">Click me</button>
      </mutation-observer>
    `);

    el.querySelector('button').className = 'btn-danger';

    const { detail } = await oneEvent(el, 'mutation-observer:change');

    expect(detail.mutationList[0]).to.be.instanceOf(MutationRecord);
  });

  it('should not observe if observer is disabled', async () => {
    const el = await fixture(html`
      <mutation-observer attr="class" disabled>
        <button type="button" class="btn-primary">Click me</button>
      </mutation-observer>
    `);

    const handler = sinon.spy();

    el.addEventListener('mutation-observer:change', handler);

    el.querySelector('button').className = 'btn-danger';

    await aTimeout(200);

    expect(handler).to.not.have.been.calledOnce;
  });

  afterEach(() => {
    fixtureCleanup();
  });
});
