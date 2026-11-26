# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking Changes

- **Explicit Package Exports**: Added a formal `exports` map to `package.json`.
  - **Supported entry points**: `@georapbox/mutation-observer-element`, `@georapbox/mutation-observer-element/define`, and `@georapbox/mutation-observer-element/custom-elements.json`.
  - **Impact**: Direct imports from internal paths (e.g., `@georapbox/mutation-observer-element/dist/...`) are no longer part of the supported public API and may fail in environments that enforce package exports.
- **Method Renaming**: Renamed the static `defineCustomElement()` method to `define()`, with a new options object supporting `prefix` and `registry`.
  - **Action Required**: Replace `MutationObserverElement.defineCustomElement()` with `MutationObserverElement.define()`. To customize the tag name, use the `prefix` option instead of passing a string. For example, `MutationObserverElement.define({ prefix: 'my' })` registers `<my-mutation-observer>`. Arbitrary tag names are no longer supported.
- **Event Renaming**: Renamed `mutation-observer:mutate` to `mutation-observer-change`.
  - **Action Required**: Update event listeners to use the new event name.
- **Event Payload Changes**: Renamed `mutationList` to `mutations` in the event's `detail` object. The `mutations` property continues to contain an array of `MutationRecord` objects.
  - **Action Required**: Replace `event.detail.mutationList` with `event.detail.mutations`.
- **Property and Attribute Renaming**: Renamed the `disabled` property and attribute to `paused` to better reflect their purpose.
  - **Action Required**: Replace `disabled` with `paused` in both HTML attributes and JavaScript property access. The behavior remains unchanged: setting `paused` to `true` stops mutation observation, while setting it to `false` resumes it.
- **Node.js Requirements**: Updated the declared engine requirements to Node.js 24 or later and npm 11.17.0 or later.

### Added

- **Automatic Registration**: Added a `/define` entry point that automatically registers the custom element using its default tag name.
- **Custom Element Registration Options**: Added support for custom tag name prefixes and custom element registries, including scoped registries, through the static `define()` method.
- **Custom Elements Manifest**: Added support for generating a Custom Elements Manifest using `@custom-elements-manifest/analyzer`, including an `analyze` script and `customElements` package metadata.
- **Documentation Deployment**: Added scripts for building and deploying the documentation to GitHub Pages.
- **Development Workflow**: Added a pre-commit hook to run linting and formatting checks before commits.

### Changed

- **Build Process**: Updated the build process to reuse the main module in the auto-defined entry point instead of creating a separate bundle.
- **Custom Event Dispatching**: Introduced a shared internal event dispatching method for consistent event creation and configuration.
- **TypeScript Support**: Refined JSDoc annotations and type definitions for improved tooling and editor support.
- **Tests**: Reorganized and expanded the test suite to cover custom element registration, property reflection, mutation events, dynamic configuration, and lifecycle behavior.
- **Documentation**: Updated the README with registration options, package imports, and API details. Refreshed the interactive examples with improved navigation and collapsible code samples.
- Updated development dependencies.

### Fixed

- Fixed an issue where changing observation-related attributes while the observer was paused could unintentionally restart mutation observation.

## [2.0.1] - 2024-08-23

### Added

- Added TypeScript declaration files.

### Changed

- Replaced Parcel with esbuild for bundling.
- Updated ESLint to use flat configuration.
- Adopted Prettier for code formatting.
- Updated development dependencies.

## 2.0.0 - 2022-11-18

### Breaking Changes

- **Distribution Changes**: Only minified production builds are included in the `dist` directory.

### Changed

- Refactored the implementation to use private class fields.
- Replaced Rollup.js with Parcel.js for bundling.
- Updated development dependencies.

## 1.0.1 - 2022-06-27

### Changed

- Enabled `composed: true` for all dispatched events, allowing them to propagate across shadow DOM boundaries.

## 1.0.0 - 2022-05-10

### Added

- Initial release.

[unreleased]: https://github.com/georapbox/mutation-observer-element/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/georapbox/mutation-observer-element/releases/tag/v2.0.1
