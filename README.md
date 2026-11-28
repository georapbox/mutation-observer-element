[![npm version](https://img.shields.io/npm/v/@georapbox/mutation-observer-element.svg)](https://www.npmjs.com/package/@georapbox/mutation-observer-element)
[![npm license](https://img.shields.io/npm/l/@georapbox/mutation-observer-element.svg)](https://www.npmjs.com/package/@georapbox/mutation-observer-element)

[demo]: https://georapbox.github.io/mutation-observer-element/
[license]: ./LICENSE
[changelog]: ./CHANGELOG.md

# &lt;mutation-observer&gt;

A custom element that offers a declarative interface to the [MutationObserver API](https://developer.mozilla.org/docs/Web/API/MutationObserver).

[API documentation](#api) &bull; [Demo][demo]

## Installation

```sh
npm install @georapbox/mutation-observer-element
```

## Registration

The package exports the element class without registering it by default.

### Manual registration

```js
import { MutationObserverElement } from '@georapbox/mutation-observer-element';

MutationObserverElement.define();
```

The element is registered only if its tag name is not already defined in the specified registry.

#### Registration options

The static `define()` method accepts an optional configuration object:

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| `prefix` | string | `""` | Prefix to prepend to the default tag name. |
| `registry` | CustomElementRegistry | `globalThis.customElements` | The registry in which to define the element. |

Alternatively, to register the element with a custom tag name prefix:

```js
MutationObserverElement.define({ prefix: 'my' });
// Registers <my-mutation-observer>
```

### Automatic registration

Import the `/define` entry point to automatically register the element with its default tag name.

```js
import '@georapbox/mutation-observer-element/define';
```

## Usage

Once registered, use the custom element in your HTML:

```html
<mutation-observer 
  attr="*"
  attr-old-value
  char-data
  char-data-old-value
  child-list
>
  <div>Observed element</div>
</mutation-observer>
```

## API

### Properties and attributes

| Property | Attribute | Type | Default | Reflects | Description |
| -------- | --------- | ---- | ------- | -------- | ----------- |
| `attr` | `attr` | string | `""` | Yes | Specifies a space-separated list of attribute names to observe. Use "*" to observe all attributes. |
| `attrOldValue` | `attr-old-value` | boolean | `false` | Yes | Records the previous values of observed attributes when enabled. Has no effect unless `attr` is configured. |
| `charData` | `char-data` | boolean | `false` | Yes | Observes changes to character data, such as text content, when enabled. |
| `charDataOldValue` | `char-data-old-value` | boolean | `false` | Yes | Records the previous values of observed character data when enabled. Has no effect unless `char-data` is enabled. |
| `childList` | `child-list` | boolean | `false` | Yes | Observes additions and removals of child nodes when enabled. |
| `paused` | `paused` | boolean | `false` | Yes | Pauses observation when enabled. Removing the attribute or setting the property to false resumes observation. |

> [!NOTE]
> At least one observation type must be enabled for mutations to be monitored.
> This requires a non-empty `attr` value (after trimming whitespace), the
> `child-list` attribute, or the `char-data` attribute. Otherwise, the observer
> remains idle.
>
> The `attr-old-value` and `char-data-old-value` attributes have no effect
> unless their corresponding observation types are enabled.

### Slots

| Name | Description |
| ---- | ----------- |
| (default) | The nodes to observe for mutations. |

### Methods

| Name | Type | Description | Arguments |
| ---- | ---- | ----------- | --------- |
| `define` | Static | Registers the custom element in the specified registry, unless already defined. | `options?: { prefix?: string, registry?: CustomElementRegistry }` |

### Events

| Name | Type | Description | Event Detail |
| ---- | ---- | ----------- | ------------ |
| `mutation-observer-change` | CustomEvent | Dispatched when the `MutationObserver` reports mutations. | `{ mutations: MutationRecord[] }` |

## Changelog

For API updates and breaking changes, check the [CHANGELOG][changelog].

## Development setup

### Prerequisites

The project requires `Node.js` and `npm` to be installed in your environment. Preferably, use [nvm](https://github.com/nvm-sh/nvm) Node Version Manager and use the version of Node.js specified in the `.nvmrc` file by running `nvm use`.

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

The tests use Playwright to run in real browsers. Install the required browser binaries if they are not already installed:

```sh
npx playwright install
```

Run the tests using any of the following commands:

```sh
npm test
npm run test:watch # watch mode
```

### Build for production

Create a production build by running the following command.

```sh
npm run build
```

### Git hooks

This repository includes a pre-commit hook that runs linting and formatting checks before each commit.

To enable the hook, run the following command from the repository root:

```sh
git config --local core.hooksPath .githooks
```

This configuration only needs to be applied once per clone and does not affect other repositories.

To verify that the hook is enabled, run:

```sh
git config --local --get core.hooksPath
```

To disable the hook, run:

```sh
git config --local --unset core.hooksPath
```

## License

[The MIT License (MIT)][license]
