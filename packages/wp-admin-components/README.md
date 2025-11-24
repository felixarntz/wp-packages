# wp-admin-components

Collection of various WordPress admin UI components.

## Installation

```bash
npm install wp-admin-components
```

## Setting Up Styles

It is crucial to include the package's CSS file for the components to render correctly.

It is recommended to copy the file to your plugin's assets location, as including the entire `node_modules` directory is discouraged. This can be automated as part of your build process.

```php
wp_enqueue_style(
	'my-plugin-wp-admin-components',
	plugin_dir_url( __FILE__ ) . 'assets/css/wp-admin-components/style.css', // Adjust path as needed.
	array( 'wp-components' ),
	'1.0.0'
);
```

## Usage

Here is an example of how to use the `MultiCheckboxControl` component.

```tsx
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MultiCheckboxControl } from 'wp-admin-components';

function MySettingsScreen() {
	const [ selectedValues, setSelectedValues ] = useState( [ 'option-1' ] );

	const options = [
		{ label: 'Option 1', value: 'option-1' },
		{ label: 'Option 2', value: 'option-2' },
		{ label: 'Option 3', value: 'option-3' },
	];

	return (
		<MultiCheckboxControl
			label={ __( 'Select Options', 'my-plugin' ) }
			options={ options }
			value={ selectedValues }
			onChange={ setSelectedValues }
			showFilter
			searchLabel={ __( 'Search options', 'my-plugin' ) }
			messageSearchResultFound={ __( '%d result found.', 'my-plugin' ) }
			messageSearchResultsFound={ __( '%d results found.', 'my-plugin' ) }
		/>
	);
}
```

## Available Components

*   `FieldsetBaseControl`
*   `HelpText`
*   `MultiCheckboxControl`
*   `OptionsFilterSearchControl`
*   `SensitiveTextControl`
*   `Tabs`

## Contributing

Contributions to the `wp-interface` package are welcome. It is being developed in a monorepo alongside my other WordPress NPM packages. Please review the [contributing guidelines](https://github.com/felixarntz/wp-packages/blob/main/CONTRIBUTING.md) to learn more about how you can contribute.
