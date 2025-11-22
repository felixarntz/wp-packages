# @felixarntz/wp-interface

Foundational components for implementing a WordPress screen reusing UI patterns from the block editor.

## Installation

```bash
npm install @felixarntz/wp-interface
```

## Setting Up Styles

It is crucial to include the package's CSS file for the components to render correctly.

It is recommended to copy the file to your plugin's assets location, as including the entire `node_modules` directory is discouraged. This can be automated as part of your build process.

```php
wp_enqueue_style(
	'my-plugin-styles',
	plugin_dir_url( __FILE__ ) . 'assets/css/wp-interface/style.css', // Adjust path as needed.
	array( 'wp-components' ),
	'1.0.0'
);
```

## Usage

The `App` component is the main entry point. It handles the layout structure automatically. You can use the `Header`, `Sidebar`, and `Footer` components to populate the respective areas.

```tsx
import { App, Header, Sidebar, Footer } from '@felixarntz/wp-interface';
import { __ } from '@wordpress/i18n';

function MyPluginScreen() {
	const labels = {
		keyboardShortcutsModalTitle: __( 'Keyboard Shortcuts', 'my-plugin' ),
		keyboardShortcutsGlobalSectionTitle: __( 'Global shortcuts', 'my-plugin' ),
		header: __( 'Header', 'my-plugin' ),
		body: __( 'Content', 'my-plugin' ),
		sidebar: __( 'Settings Sidebar', 'my-plugin' ),
		footer: __( 'Footer', 'my-plugin' ),
	};

	return (
		<App scope="my-plugin" labels={ labels }>
			<Header>
				<h1>{ __( 'My Plugin', 'my-plugin' ) }</h1>
			</Header>

			<Sidebar>
				<p>{ __( 'Sidebar content goes here.', 'my-plugin' ) }</p>
			</Sidebar>

			<div className="my-plugin-content">
				<p>{ __( 'Main content area.', 'my-plugin' ) }</p>
			</div>

			<Footer>
				<p>{ __( 'Version 1.0', 'my-plugin' ) }</p>
			</Footer>
		</App>
	);
}
```

## Localization

The `App` component requires a `labels` prop to provide localized strings for the interface regions and the keyboard shortcuts modal.

```tsx
import { __ } from '@wordpress/i18n';

const labels = {
	// Passed to App/KeyboardShortcutsHelpModal
	keyboardShortcutsModalTitle: __( 'Keyboard Shortcuts', 'my-plugin' ),
	keyboardShortcutsGlobalSectionTitle: __( 'Global shortcuts', 'my-plugin' ),

	// Passed to InterfaceSkeleton (ARIA labels for regions)
	header: __( 'Header', 'my-plugin' ),
	body: __( 'Content', 'my-plugin' ),
	sidebar: __( 'Settings Sidebar', 'my-plugin' ),
	actions: __( 'Actions', 'my-plugin' ),
	footer: __( 'Footer', 'my-plugin' ),
};
```
