[![npm version](https://img.shields.io/npm/v/@georapbox/mutation-observer-element.svg)](https://www.npmjs.com/package/@georapbox/mutation-observer-element)
[![npm license](https://img.shields.io/npm/l/@georapbox/mutation-observer-element.svg)](https://www.npmjs.com/package/@georapbox/mutation-observer-element)

[demo]: https://georapbox.github.io/mutation-observer-element/
[license]: https://github.com/georapbox/mutation-observer-element/blob/main/LICENSE
[changelog]: https://github.com/georapbox/mutation-observer-element/blob/main/CHANGELOG.md

# &lt;mutation-observer&gt;

A custom element that offers a declarative interface to the [MutationObserver API](https://developer.mozilla.org/docs/Web/API/MutationObserver).

[API documentation](#api) &bull; [Demo][demo]

## Install

```sh
$ npm install --save @georapbox/mutation-observer-element
```

## Usage

### Script

```js
import { MutationObserverElement } from './node_modules/@georapbox/mutation-observer-element/dist/mutation-observer.js';

// Manually define the element.
MutationObserverElement.defineCustomElement();
```

Alternatively, you can import the automatically defined custom element.

```js
import './node_modules/@georapbox/mutation-observer-element/dist/mutation-observer-defined.js';
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
| `attr` | ✓ | String | `""` | A space-separated string of attribute names to monitor (e.g., "title class href"). Use "*" to monitor all attributes. |
| `attrOldValue`<br><small>`attr-old-value`</small> | ✓ | Boolean | `false` | Set to `true` to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes. |
| `childList`<br><small>`child-list`</small> | ✓ | Boolean | `false` | Set to `true` to monitor the target node for the addition of new child nodes or removal of existing child nodes. |
| `charData`<br><small>`char-data`</small> | ✓ | Boolean | `false` | Set to `true` to monitor the specified target node for changes to the character data contained within the node or nodes. |
| `charDataOldValue`<br><small>`char-data-old-value`</small> | ✓ | Boolean | `false` | Set to `true` to record the previous value of a node's text whenever the text changes on nodes being monitored. |
| `disabled` | ✓ | Boolean | `false` | Set to `true` to stop monitoring for mutations. |

> NOTE: From the properties above, at least one of `attr`, `child-list` or `char-data` must be present, otherwise, no changes are monitored and no mutation events are emitted.

### Slots

| Name | Description |
| ---- | ----------- |
| (default) | The default slot where the target node or nodes to be monitored are placed. |

### Methods

| Name | Type | Description | Arguments |
| ---- | ---- | ----------- | --------- |
| `defineCustomElement` | Static | Defines/registers the custom element with the name provided. If no name is provided, the default name is used. The method checks if the element is already defined, hence will skip trying to redefine it. | `elementName='mutation-observer'` |

### Events

| Name | Description | Event Detail |
| ---- | ----------- | ------------ |
| `mutation-observer:mutate` | Emitted when the element is mutated. | `{ mutationList: MutationRecord[]` |

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## Development setup

### Prerequisites

The project requires `Node.js` and `npm` to be installed on your environment. Preferrably, use [nvm](https://github.com/nvm-sh/nvm) Node Version Manager and use the version of Node.js specified in the `.nvmrc` file by running `nvm use`.

### Install dependencies

Install the project dependencies by running the following command.

```sh
npm install
```

### Build for development

Watch for changes and start a development server by running the following command.

```sh
npm start
```

### Linting

Lint the code by running the following command.

```sh
npm run lint
```

### Testing

Run the tests by running any of the following commands.

```sh
npm test
npm run test:watch # watch mode
```

### Build for production

Create a production build by running the following command.

```sh
npm run build
```

## License

[The MIT License (MIT)][license]
