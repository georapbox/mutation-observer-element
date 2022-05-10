import { elementUpdated, expect, fixture, fixtureCleanup, html, aTimeout, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/mutation-observer-defined.js';

describe('<mutation-observer>', () => {
  it('default properties', async () => {
    const el = await fixture(html`<mutation-observer></mutation-observer>`);

    expect(el.attr).to.be.null;
    expect(el.getAttribute('attr')).to.be.null;

    expect(el.attrOldValue).to.be.false;
    expect(el.getAttribute('attr-old-value')).to.be.null;

    expect(el.childList).to.be.false;
    expect(el.getAttribute('child-list')).to.be.null;

    expect(el.charData).to.be.false;
    expect(el.getAttribute('char-data')).to.be.null;

    expect(el.charDataOldValue).to.be.false;
    expect(el.getAttribute('char-data-old-value')).to.be.null;

    expect(el.disabled).to.be.false;
    expect(el.getAttribute('disabled')).to.be.null;
  });

  it('change default properties', async () => {
    const el = await fixture(html`
      <mutation-observer
        attr="*"
        attr-old-value
        child-list
        char-data
        char-data-old-value
        disabled
      ></mutation-observer>
    `);

    expect(el.attr).to.equal('*');
    expect(el.getAttribute('attr')).to.equal('*');

    expect(el.attrOldValue).to.be.true;
    expect(el.getAttribute('attr-old-value')).to.equal('');

    expect(el.childList).to.be.true;
    expect(el.getAttribute('child-list')).to.equal('');

    expect(el.charData).to.be.true;
    expect(el.getAttribute('char-data')).to.equal('');

    expect(el.charDataOldValue).to.be.true;
    expect(el.getAttribute('char-data-old-value')).to.equal('');

    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.equal('');
  });

  it('change properties programmatically', async () => {
    const el = await fixture(html`<mutation-observer></mutation-observer>`);

    el.attr = '*';
    el.attrOldValue = true;
    el.childList = true;
    el.charData = true;
    el.charDataOldValue = true;
    el.disabled = true;

    await elementUpdated(el);

    expect(el.attr).to.equal('*');
    expect(el.getAttribute('attr')).to.equal('*');

    expect(el.attrOldValue).to.be.true;
    expect(el.getAttribute('attr-old-value')).to.equal('');

    expect(el.childList).to.be.true;
    expect(el.getAttribute('child-list')).to.equal('');

    expect(el.charData).to.be.true;
    expect(el.getAttribute('char-data')).to.equal('');

    expect(el.charDataOldValue).to.be.true;
    expect(el.getAttribute('char-data-old-value')).to.equal('');

    expect(el.disabled).to.be.true;
    expect(el.getAttribute('disabled')).to.equal('');

    // // toggle boolean properties
    el.attrOldValue = false;
    el.childList = false;
    el.charData = false;
    el.charDataOldValue = false;
    el.disabled = false;

    await elementUpdated(el);

    expect(el.attrOldValue).to.be.false;
    expect(el.getAttribute('attr-old-value')).to.be.null;

    expect(el.childList).to.be.false;
    expect(el.getAttribute('child-list')).to.be.null;

    expect(el.charData).to.be.false;
    expect(el.getAttribute('char-data')).to.be.null;

    expect(el.charDataOldValue).to.be.false;
    expect(el.getAttribute('char-data-old-value')).to.be.null;

    expect(el.disabled).to.be.false;
    expect(el.getAttribute('disabled')).to.be.null;
  });

  it('observe attributes change: class', async () => {
    const el = await fixture(html`
      <mutation-observer attr="class" attr-old-value>
        <button type="button" class="btn-primary">Click me</button>
      </mutation-observer>
    `);

    el.querySelector('button').className = 'btn-danger';

    const { detail } = await oneEvent(el, 'mutation-observer:mutate');
    const [mutationRecord] = detail.mutationList;

    expect(mutationRecord).to.be.instanceOf(MutationRecord);
    expect(mutationRecord.type).to.equal('attributes');
    expect(mutationRecord.attributeName).to.equal('class');
    expect(mutationRecord.oldValue).to.equal('btn-primary');
  });

  it('observe addition of new child nodes', async () => {
    const el = await fixture(html`
      <mutation-observer child-list></mutation-observer>
    `);

    let count = 0;
    const node = document.createElement('div');
    node.textContent = ++count;

    el.appendChild(node);

    const { detail } = await oneEvent(el, 'mutation-observer:mutate');
    const [mutationRecord] = detail.mutationList;

    expect(mutationRecord).to.be.instanceOf(MutationRecord);
    expect(mutationRecord.type).to.equal('childList');
    expect(mutationRecord.addedNodes[0]).to.be.instanceOf(HTMLDivElement);
    expect(mutationRecord.addedNodes[0].textContent).to.equal('1');
  });

  it('should not emit mutation events observer is disabled', async () => {
    const el = await fixture(html`
      <mutation-observer attr="class" disabled>
        <button type="button" class="btn-primary">Click me</button>
      </mutation-observer>
    `);

    const handler = sinon.spy();

    el.addEventListener('mutation-observer:mutate', handler);

    el.querySelector('button').className = 'btn-danger';

    await aTimeout(200);

    expect(handler).to.not.have.been.calledOnce;
  });

  afterEach(() => {
    fixtureCleanup();
  });
});
