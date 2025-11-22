# @felixarntz/wp-store-utils

Utility functions and types for working with WordPress data stores.

## Installation

```bash
npm install @felixarntz/wp-store-utils
```

## Usage

This package allows you to split a large WordPress data store into smaller, manageable, and domain-specific files using `combineStoreConfigs`.

```typescript
import { registerStore } from '@wordpress/data';
import { combineStoreConfigs } from '@felixarntz/wp-store-utils';
import { featureOneConfig } from './feature-one';
import { featureTwoConfig } from './feature-two';

// Combine partial configs into one.
const finalConfig = combineStoreConfigs( featureOneConfig, featureTwoConfig );

// Register the store with WordPress.
registerStore( 'my-plugin/store', finalConfig );
```

## API

### `combineStoreConfigs( ...configs )`

Merges multiple partial store configuration objects into one. It combines reducers, actions, selectors, and resolvers, while validating for duplicate keys.

### Types

The package exports comprehensive TypeScript interfaces for WordPress data stores, including:

- `StoreConfig`
- `StoreActions`
- `StoreSelectors`
- `StoreResolvers`
