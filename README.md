[![npm version](https://img.shields.io/npm/v/@georapbox/mutation-observer-element.svg)](https://www.npmjs.com/package/@georapbox/mutation-observer-element)
[![npm license](https://img.shields.io/npm/l/@georapbox/mutation-observer-element.svg)](https://www.npmjs.com/package/@georapbox/mutation-observer-element)

[demo]: https://georapbox.github.io/mutation-observer-element/
[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements
[license]: https://georapbox.mit-license.org/@2022
[changelog]: https://github.com/georapbox/mutation-observer-element/blob/main/CHANGELOG.md

# &lt;mutation-observer&gt; element

A custom element that offers a declarative interface to the [MutationObserver API](https://developer.mozilla.org/docs/Web/API/MutationObserver).

[API documentation](#api) &bull; [Demo][demo]

## Install

```sh
$ npm install --save @georapbox/mutation-observer-element
```

## Usage

### Script

```js
import { MutationObserverElement } from './node_modules/@georapbox/mutation-observer-element/dist/mutation-observer.min.js';

// Manually define the element.
MutationObserverElement.defineCustomElement();
```

Alternatively, you can import the automatically defined custom element.

```js
import './node_modules/@georapbox/mutation-observer-element/dist/mutation-observer-defined.min.js';
```

### Markup

```html
<mutation-observer 
  attr="*"
  attr-old-value
  char-data
  char-data-old-value
  child-list
>
  <button class="btn-primary">Click to mutate me</button>
</mutation-observer>
```

## API

### Properties
| Name | Reflects | Type | Default | Description |
| ---- | -------- | ---- | ------- | ----------- |
| `attr` | ✓ | String | `null` | A string of attribute names to be monitored. To monitor specific attributes' changes, separate them by a space, eg `title class href`. To monitor all attributes' changes, use `*`. |
| `attrOldValue`<br><small>`attr-old-value`</small> | ✓ | Boolean | `false` | Set to `true` to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes. |
| `childList`<br><small>`child-list`</small> | ✓ | Boolean | `false` |  Set to `true` to monitor the target node for the addition of new child nodes or removal of existing child nodes. |
| `charData`<br><small>`char-data`</small> | ✓ | Boolean | `false` | Set to `true` to monitor the specified target node for changes to the character data contained within the node or nodes. |
| `charDataOldValue`<br><small>`char-data-old-value`</small> | ✓ | Boolean | `false` | Set to `true` to record the previous value of a node's text whenever the text changes on nodes being monitored. |
| `disabled` | ✓ | Boolean | `false` | Set to `true` to stop monitoring for mutations. |

All of the above properties reflect their values as HTML attributes to keep the element's DOM representation in sync with its JavaScript state.

> NOTE: From the properties above, at least one of `attr`, `child-list` or `char-data` must be present, otherwise, no changes are monitored and no mutation events are emitted.

### Slots

| Name | Description |
| ---- | ----------- |
| (default) | The element(s) to observe for mutations. |

### Events

`mutation-observer:mutate` - Emitted when the element is mutated. A list of [MutationRecord](https://developer.mozilla.org/docs/Web/API/MutationRecord) objects is attached to `event.detail`, with information about how the target element has been changed.

```js
document.querySelector('mutation-observer').addEventListener('mutation-observer:mutate', evt => {
  console.log(evt.detail); // => { mutationList: [MutationRecord] }
});
```

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## Browser support

Browsers without native [custom element support][support] require a [polyfill][polyfill].

- Firefox
- Chrome
- Microsoft Edge
- Safari

## License

[The MIT License (MIT)][license]
