[![npm version](https://img.shields.io/npm/v/@georapbox/mutation-observer-element.svg)](https://www.npmjs.com/package/@georapbox/mutation-observer-element)
[![npm license](https://img.shields.io/npm/l/@georapbox/mutation-observer-element.svg)](https://www.npmjs.com/package/@georapbox/mutation-observer-element)

[demo]: https://georapbox.github.io/mutation-observer-element/
[license]: https://github.com/georapbox/mutation-observer-element/blob/main/LICENSE
[changelog]: https://github.com/georapbox/mutation-observer-element/blob/main/CHANGELOG.md

# &lt;mutation-observer&gt;

A custom element that offers a declarative interface to the [MutationObserver API](https://developer.mozilla.org/docs/Web/API/MutationObserver).

[API documentation](#api) &bull; [Demo][demo]

## Installation

Install the package using npm:

```sh
npm install @georapbox/mutation-observer-element
```

## Registration

By default, the package exports the element class without registering it.
This lets the application decide when the custom element is defined.

### Manual registration

Import the `MutationObserverElement` class and call its static `define()` method:

```js
import { MutationObserverElement } from '@georapbox/mutation-observer-element';

MutationObserverElement.define();
```

This registers `<mutation-observer>` in the global `customElements` registry.

You only need to call `MutationObserverElement.define()` once. Subsequent calls are ignored if the tag name is already registered.

### Automatic registration

If you don't need control over registration, import the convenience entry point:

```js
import '@georapbox/mutation-observer-element/define';
```

This automatically registers `<mutation-observer>` with its default name.

You can also import the `MutationObserverElement` class from this entry point:

```js
import { MutationObserverElement } from '@georapbox/mutation-observer-element/define';
```

There is no need to call `MutationObserverElement.define()` when using this entry point.

### Custom element names

You can provide a `prefix` to register the element under a different name:

```js
import { MutationObserverElement } from '@georapbox/mutation-observer-element';

MutationObserverElement.define({ prefix: 'my' });
```

This registers `<my-mutation-observer>` instead of `<mutation-observer>`.

You must use the prefixed name in your HTML:

```html
<my-mutation-observer></my-mutation-observer>
```

> [!NOTE]
> A custom element constructor can only be registered under one name within the same registry. Choose either the default name or a custom prefix for a given registry.

### Custom element registry

You can specify a custom element registry using the `registry` option:

```js
import { MutationObserverElement } from '@georapbox/mutation-observer-element';

const registry = new CustomElementRegistry();

MutationObserverElement.define({ registry });
```

By default, the global `customElements` registry is used. You can also provide a [scoped custom element registry](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#scoped_custom_element_registries) to register the elements within a specific scope.

> [!NOTE]
> Scoped registries must be associated with a DOM scope before their registered elements can be used. Check browser compatibility if you need to support older browsers.

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
  <button class="btn-primary">Click to mutate me</button>
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
> This requires a non-empty `attr` value, the `child-list` attribute, or the
> `char-data` attribute. Otherwise, the observer remains idle.
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
