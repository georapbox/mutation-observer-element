const isLocalhost = window.location.href.includes('127.0.0.1') || window.location.href.includes('localhost');
const componentUrl = isLocalhost ? '../../dist/mutation-observer-defined.js' : '../lib/mutation-observer-defined.js';

import(componentUrl).then(() => {
  // Example 1
  (function () {
    const mutationObserverEl = document.getElementById('mutationObserver1');
    const button = mutationObserverEl.querySelector('button');
    const classNames = ['primary', 'success', 'danger', 'warning', 'info'];
    let count = 0;

    button.addEventListener('click', evt => {
      count += 1;
      evt.target.className = `btn-${classNames[count % classNames.length]}`;
    });
  }());

  // Example 2
  (function () {
    const addButton = document.getElementById('addButton');
    const removeButton = document.getElementById('removeButton');
    const elementsContainer = document.getElementById('elementsContainer');
    let count = 0;

    addButton.addEventListener('click', () => {
      const el = document.createElement('div');
      el.textContent = ++count;
      elementsContainer.appendChild(el);
    });

    removeButton.addEventListener('click', () => {
      const lastElement = elementsContainer.querySelector('div:last-child');

      if (lastElement) {
        count -= 1;
        lastElement.remove();
      }
    });
  }());

  // Register events
  document.addEventListener('mutation-observer:mutate', evt => {
    console.log('mutation-observer:mutate ->', evt.detail);
  });
}).catch(err => {
  console.error(err);
});
