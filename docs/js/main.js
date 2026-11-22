import '../lib/browser-window.js';

const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
const basePath = isLocal ? '../..' : '..';
const componentUrl = `${basePath}/dist/mutation-observer.js`;

const { MutationObserverElement } = await import(componentUrl);
MutationObserverElement.define();

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
})();

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
    const lastElement = elementsContainer.lastElementChild;
    console.log(lastElement);

    if (lastElement) {
      count -= 1;
      lastElement.remove();
    }
  });
})();

document.addEventListener('mutation-observer-change', evt => {
  console.table('mutation-observer-change', evt.detail);
});
