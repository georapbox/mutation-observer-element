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
// TODO
```

## API

### Properties
| Name | Reflects | Type | Default | Description |
| ---- | -------- | ---- | ------- | ----------- |
| `disabled` | ✓ | Boolean | `false` | Defines if the mutation observer is disabled or not. |
// TODO

All of the above properties reflect their values as HTML attributes to keep the element's DOM representation in sync with its JavaScript state.

### Slots

| Name | Description |
| ---- | ----------- |
| (default) | The element(s) to observe for mutations. |

### Events

`mutation-observer:change` - Emitted when the element is mutated. A list of [MutationRecord](https://developer.mozilla.org/docs/Web/API/MutationRecord) objects is attached to `event.detail`, with information about how the target element has been changed.

```js
document.querySelector('mutation-observer').addEventListener('mutation-observer:change', evt => {
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
