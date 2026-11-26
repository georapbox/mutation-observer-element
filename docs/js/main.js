import '../lib/browser-window.js';

const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
const basePath = isLocal ? '../..' : '..';
const componentUrl = `${basePath}/dist/mutation-observer.js`;

const { MutationObserverElement } = await import(componentUrl);
MutationObserverElement.define();

// Example 1 - Attribute changes
(function () {
  const mutationObserverEl = document.getElementById('mutationObserver1');
  const output = document.getElementById('mutationOutput1');
  const checkbox = document.getElementById('taskCheckbox');
  const taskItem = document.getElementById('taskItem');
  const taskStatus = document.getElementById('taskStatus');

  checkbox.addEventListener('change', () => {
    taskItem.classList.toggle('completed', checkbox.checked);
    taskStatus.textContent = checkbox.checked ? 'Completed' : 'Pending';
  });

  mutationObserverEl.addEventListener('mutation-observer-change', evt => {
    const mutation = evt.detail.mutations.at(-1);

    if (mutation?.type === 'attributes') {
      const oldValue = mutation.oldValue ?? '(none)';
      const newValue = mutation.target.getAttribute(mutation.attributeName);

      output.value = `${mutation.attributeName}: ${oldValue} → ${newValue}`;
    }
  });
})();

// Example 2 - Child node changes
(function () {
  const mutationObserverEl = document.getElementById('mutationObserver2');
  const output = document.getElementById('mutationOutput2');
  const addButton = document.getElementById('addButton');
  const removeButton = document.getElementById('removeButton');
  const taskList = document.getElementById('taskList');
  let count = taskList.children.length;

  addButton.addEventListener('click', () => {
    const task = document.createElement('li');
    task.textContent = `Task ${++count}`;
    taskList.appendChild(task);
  });

  removeButton.addEventListener('click', () => {
    const lastTask = taskList.lastElementChild;

    if (lastTask) {
      lastTask.remove();
    }
  });

  mutationObserverEl.addEventListener('mutation-observer-change', evt => {
    const mutation = evt.detail.mutations.at(-1);

    if (mutation?.type === 'childList') {
      if (mutation.addedNodes.length) {
        output.value = `Added: ${mutation.addedNodes[0].textContent}`;
      } else if (mutation.removedNodes.length) {
        output.value = `Removed: ${mutation.removedNodes[0].textContent}`;
      }
    }
  });
})();

// Example 3 - Character data changes
(function () {
  const mutationObserverEl = document.getElementById('mutationObserver3');
  const output = document.getElementById('mutationOutput3');
  const input = document.getElementById('taskNameInput');
  const taskLabel = document.getElementById('taskLabel');

  input.addEventListener('input', () => {
    taskLabel.firstChild.data = input.value;
  });

  mutationObserverEl.addEventListener('mutation-observer-change', evt => {
    const mutation = evt.detail.mutations.at(-1);

    if (mutation?.type === 'characterData') {
      output.value = `${mutation.oldValue} → ${mutation.target.data}`;
    }
  });
})();

// Log mutation events from all examples
document.querySelectorAll('mutation-observer').forEach(el => {
  el.addEventListener('mutation-observer-change', evt => {
    console.log('mutation-observer-change', evt.detail.mutations);
  });
});
