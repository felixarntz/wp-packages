# wp-component-utils

Utility functions and types for working with WordPress components.

## Installation

```bash
npm install wp-component-utils
```

## Usage

This package provides TypeScript utility types for working with WordPress components.

```typescript
import type { WordPressComponentProps } from 'wp-component-utils';

export function MyInputBasedComponent(
	props: WordPressComponentProps< MyInputBasedComponentProps, 'input' >
) {
	const { label, hideLabelFromVision, ...inputProps } = props;

	// Component logic and rendering.
}
```

## API

### Types

The package exports comprehensive TypeScript interfaces for WordPress components, including:

- `WordPressComponentProps`
- `WordPressComponent`
- `WordPressComponentFromProps`

## Contributing

Contributions to the `wp-component-utils` package are welcome. It is being developed in a monorepo alongside my other WordPress NPM packages. Please review the [contributing guidelines](https://github.com/felixarntz/wp-packages/blob/main/CONTRIBUTING.md) to learn more about how you can contribute.
