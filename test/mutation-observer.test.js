import { aTimeout, expect, fixture, fixtureCleanup, html, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import { MutationObserverElement } from '../src/mutation-observer.js';

MutationObserverElement.define();

describe('mutation-observer', () => {
  afterEach(() => {
    fixtureCleanup();
    sinon.restore();
  });

  describe('definition', () => {
    it('should not redefine the custom element when it is already registered', () => {
      const defineSpy = sinon.spy(window.customElements, 'define');

      expect(() => MutationObserverElement.define()).to.not.throw();
      sinon.assert.notCalled(defineSpy);
    });

    it('should register the custom element with a prefix without redefining it', () => {
      class PrefixedMutationObserverElement extends MutationObserverElement {}

      const defineSpy = sinon.spy(window.customElements, 'define');

      PrefixedMutationObserverElement.define({ prefix: 'test' });

      expect(customElements.get('test-mutation-observer')).to.equal(PrefixedMutationObserverElement);
      sinon.assert.calledOnceWithExactly(defineSpy, 'test-mutation-observer', PrefixedMutationObserverElement);

      PrefixedMutationObserverElement.define({ prefix: 'test' });

      sinon.assert.calledOnce(defineSpy);
    });
  });

  describe('attributes - properties', () => {
    it('should have default property values', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      expect(el.attr).to.equal('');
      expect(el.hasAttribute('attr')).to.be.false;
      expect(el.attrOldValue).to.be.false;
      expect(el.hasAttribute('attr-old-value')).to.be.false;
      expect(el.childList).to.be.false;
      expect(el.hasAttribute('child-list')).to.be.false;
      expect(el.charData).to.be.false;
      expect(el.hasAttribute('char-data')).to.be.false;
      expect(el.charDataOldValue).to.be.false;
      expect(el.hasAttribute('char-data-old-value')).to.be.false;
      expect(el.disabled).to.be.false;
      expect(el.hasAttribute('disabled')).to.be.false;
    });

    // attr
    it('reflects attribute "attr" to property "attr"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.setAttribute('attr', 'class title');

      expect(el.attr).to.equal('class title');
    });

    it('reflects property "attr" to attribute "attr"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.attr = 'class';

      expect(el.getAttribute('attr')).to.equal('class');
    });

    // attr-old-value
    it('reflects attribute "attr-old-value" to property "attrOldValue"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.setAttribute('attr-old-value', '');

      expect(el.attrOldValue).to.be.true;
    });

    it('reflects property "attrOldValue" to attribute "attr-old-value"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.attrOldValue = true;
      expect(el.hasAttribute('attr-old-value')).to.be.true;

      el.attrOldValue = false;
      expect(el.hasAttribute('attr-old-value')).to.be.false;
    });

    // child-list
    it('reflects attribute "child-list" to property "childList"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.setAttribute('child-list', '');

      expect(el.childList).to.be.true;
    });

    it('reflects property "childList" to attribute "child-list"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.childList = true;
      expect(el.hasAttribute('child-list')).to.be.true;

      el.childList = false;
      expect(el.hasAttribute('child-list')).to.be.false;
    });

    // char-data
    it('reflects attribute "char-data" to property "charData"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.setAttribute('char-data', '');

      expect(el.charData).to.be.true;
    });

    it('reflects property "charData" to attribute "char-data"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.charData = true;
      expect(el.hasAttribute('char-data')).to.be.true;

      el.charData = false;
      expect(el.hasAttribute('char-data')).to.be.false;
    });

    // char-data-old-value
    it('reflects attribute "char-data-old-value" to property "charDataOldValue"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.setAttribute('char-data-old-value', '');

      expect(el.charDataOldValue).to.be.true;
    });

    it('reflects property "charDataOldValue" to attribute "char-data-old-value"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.charDataOldValue = true;
      expect(el.hasAttribute('char-data-old-value')).to.be.true;

      el.charDataOldValue = false;
      expect(el.hasAttribute('char-data-old-value')).to.be.false;
    });

    // disabled
    it('reflects attribute "disabled" to property "disabled"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.setAttribute('disabled', '');

      expect(el.disabled).to.be.true;
    });

    it('reflects property "disabled" to attribute "disabled"', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);

      el.disabled = true;
      expect(el.hasAttribute('disabled')).to.be.true;

      el.disabled = false;
      expect(el.hasAttribute('disabled')).to.be.false;
    });
  });

  describe('slots', () => {
    it('should have a default/unnamed slot', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);
      const slot = el.shadowRoot.querySelector('slot:not([name])');

      expect(slot).to.exist;

      const child = document.createElement('span');
      el.appendChild(child);

      expect(slot.assignedElements()).to.deep.equal([child]);
    });
  });

  describe('custom events', () => {
    it('should dispatch "mutation-observer-change" for an attribute change', async () => {
      const el = await fixture(html`
        <mutation-observer attr="class" attr-old-value>
          <button type="button" class="btn-primary">Click me</button>
        </mutation-observer>
      `);
      const button = el.querySelector('button');
      const listener = oneEvent(el, 'mutation-observer-change');

      button.className = 'btn-danger';

      const event = await listener;
      const [record] = event.detail.mutations;

      expect(event).to.be.instanceOf(CustomEvent);
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
      expect(event.cancelable).to.be.false;
      expect(record).to.be.instanceOf(MutationRecord);
      expect(record.type).to.equal('attributes');
      expect(record.target).to.equal(button);
      expect(record.attributeName).to.equal('class');
      expect(record.oldValue).to.equal('btn-primary');
    });

    it('should observe all attributes when "attr" is "*"', async () => {
      const el = await fixture(html`
        <mutation-observer attr="*">
          <button type="button">Click me</button>
        </mutation-observer>
      `);
      const button = el.querySelector('button');
      const listener = oneEvent(el, 'mutation-observer-change');

      button.setAttribute('data-state', 'active');

      const event = await listener;
      const [record] = event.detail.mutations;

      expect(record.type).to.equal('attributes');
      expect(record.attributeName).to.equal('data-state');
    });

    it('should dispatch "mutation-observer-change" when a child is added', async () => {
      const el = await fixture(html`<mutation-observer child-list></mutation-observer>`);
      const child = document.createElement('div');
      child.textContent = 'New child';
      const listener = oneEvent(el, 'mutation-observer-change');

      el.appendChild(child);

      const event = await listener;
      const [record] = event.detail.mutations;

      expect(record).to.be.instanceOf(MutationRecord);
      expect(record.type).to.equal('childList');
      expect(record.target).to.equal(el);
      expect(record.addedNodes[0]).to.equal(child);
    });

    it('should dispatch "mutation-observer-change" when a child is removed', async () => {
      const el = await fixture(html`
        <mutation-observer child-list>
          <span>Existing child</span>
        </mutation-observer>
      `);
      const child = el.querySelector('span');
      const listener = oneEvent(el, 'mutation-observer-change');

      child.remove();

      const event = await listener;
      const [record] = event.detail.mutations;

      expect(record.type).to.equal('childList');
      expect(record.removedNodes[0]).to.equal(child);
    });

    it('should dispatch "mutation-observer-change" for character data changes', async () => {
      const el = await fixture(html`
        <mutation-observer char-data char-data-old-value>
          <p>Original text</p>
        </mutation-observer>
      `);
      const text = el.querySelector('p').firstChild;
      const listener = oneEvent(el, 'mutation-observer-change');

      text.textContent = 'Updated text';

      const event = await listener;
      const [record] = event.detail.mutations;

      expect(record).to.be.instanceOf(MutationRecord);
      expect(record.type).to.equal('characterData');
      expect(record.target).to.equal(text);
      expect(record.oldValue).to.equal('Original text');
    });
  });

  describe('element behavior', () => {
    it('should only observe the attributes specified by "attr"', async () => {
      const el = await fixture(html`
        <mutation-observer attr="class">
          <button type="button">Click me</button>
        </mutation-observer>
      `);
      const button = el.querySelector('button');
      const spy = sinon.spy();
      el.addEventListener('mutation-observer-change', spy);

      button.setAttribute('title', 'Not observed');
      await aTimeout(0);

      expect(spy.called).to.be.false;

      const listener = oneEvent(el, 'mutation-observer-change');
      button.className = 'observed';
      await listener;

      expect(spy.calledOnce).to.be.true;
    });

    it('should observe mutations in descendants', async () => {
      const el = await fixture(html`
        <mutation-observer child-list>
          <div><span>Existing child</span></div>
        </mutation-observer>
      `);
      const container = el.querySelector('div');
      const child = document.createElement('span');
      const listener = oneEvent(el, 'mutation-observer-change');

      container.appendChild(child);

      const event = await listener;
      const [record] = event.detail.mutations;

      expect(record.type).to.equal('childList');
      expect(record.target).to.equal(container);
      expect(record.addedNodes[0]).to.equal(child);
    });

    it('should not observe mutations when no observation options are set', async () => {
      const el = await fixture(html`
        <mutation-observer>
          <button type="button">Click me</button>
        </mutation-observer>
      `);
      const spy = sinon.spy();
      el.addEventListener('mutation-observer-change', spy);

      el.querySelector('button').className = 'changed';
      el.appendChild(document.createElement('span'));
      await aTimeout(0);

      expect(spy.called).to.be.false;
    });

    it('should restart observing when "attr" changes', async () => {
      const el = await fixture(html`
        <mutation-observer attr="class">
          <button type="button">Click me</button>
        </mutation-observer>
      `);
      const button = el.querySelector('button');
      const spy = sinon.spy();
      el.addEventListener('mutation-observer-change', spy);

      el.attr = 'title';
      button.className = 'not-observed';
      await aTimeout(0);

      expect(spy.called).to.be.false;

      const listener = oneEvent(el, 'mutation-observer-change');
      button.title = 'Observed';
      await listener;

      expect(spy.calledOnce).to.be.true;
      expect(spy.firstCall.args[0].detail.mutations[0].attributeName).to.equal('title');
    });

    it('should start and stop observing when "childList" changes', async () => {
      const el = await fixture(html`<mutation-observer></mutation-observer>`);
      const spy = sinon.spy();
      el.addEventListener('mutation-observer-change', spy);

      el.childList = true;
      const listener = oneEvent(el, 'mutation-observer-change');
      el.appendChild(document.createElement('span'));
      await listener;

      expect(spy.calledOnce).to.be.true;

      el.childList = false;
      el.appendChild(document.createElement('span'));
      await aTimeout(0);

      expect(spy.calledOnce).to.be.true;
    });

    it('should stop and resume observing when "disabled" changes', async () => {
      const el = await fixture(html`
        <mutation-observer attr="class" disabled>
          <button type="button">Click me</button>
        </mutation-observer>
      `);
      const button = el.querySelector('button');
      const spy = sinon.spy();
      el.addEventListener('mutation-observer-change', spy);

      button.className = 'while-disabled';
      await aTimeout(0);
      expect(spy.called).to.be.false;

      el.disabled = false;
      const listener = oneEvent(el, 'mutation-observer-change');
      button.className = 'while-enabled';
      await listener;
      expect(spy.calledOnce).to.be.true;

      el.disabled = true;
      button.className = 'disabled-again';
      await aTimeout(0);
      expect(spy.calledOnce).to.be.true;
    });

    it('should stop observing when disconnected and resume when reconnected', async () => {
      const container = await fixture(html`
        <div>
          <mutation-observer attr="class">
            <button type="button">Click me</button>
          </mutation-observer>
        </div>
      `);
      const el = container.querySelector('mutation-observer');
      const button = el.querySelector('button');
      const spy = sinon.spy();
      el.addEventListener('mutation-observer-change', spy);

      el.remove();
      button.className = 'while-disconnected';
      await aTimeout(0);
      expect(spy.called).to.be.false;

      container.appendChild(el);
      const listener = oneEvent(el, 'mutation-observer-change');
      button.className = 'after-reconnection';
      await listener;

      expect(spy.calledOnce).to.be.true;
    });
  });
});
