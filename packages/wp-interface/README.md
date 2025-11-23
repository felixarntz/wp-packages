# wp-interface

Foundational components for implementing a WordPress screen reusing UI patterns from the block editor.

Get started with a UI like this in less than 5 minutes:

![Screenshot of a custom WordPress Admin page with foundational UI resembling the block editor](https://github.com/user-attachments/assets/1de5c933-36bb-43af-b23f-6a6ba2cc8713)

## Installation

```bash
npm install wp-interface
```

## Setting Up Styles

It is crucial to include the package's CSS file for the components to render correctly.

It is recommended to copy the file to your plugin's assets location, as including the entire `node_modules` directory is discouraged. This can be automated as part of your build process.

```php
wp_enqueue_style(
	'my-plugin-styles',
	plugin_dir_url( __FILE__ ) . 'assets/css/wp-interface/style.css', // Adjust path as needed.
	array( 'wp-components', 'wp-editor' ),
	'1.0.0'
);
```

## Usage

The `App` component is the main entry point. It handles the layout structure automatically. You can use the `Header`, `HeaderActions`, `Sidebar`, and `Footer` components to populate the respective areas.

```tsx
import { App, Header, HeaderActions, PinnedSidebars, MoreMenu, Sidebar, Footer } from 'wp-interface';
import { Button } from '@wordpress/components';
import { __, _x, isRTL } from '@wordpress/i18n';
import { drawerLeft, drawerRight } from '@wordpress/icons';

function MyPluginScreen() {
	const labels = {
		/* UI labels for i18n go here. */
	};

	return (
		<App scope="my-plugin" labels={ labels }>
			<Header>
				<h1>{ __( 'My Plugin', 'my-plugin' ) }</h1>
				<HeaderActions>
					<Button variant="primary">
						{ __( 'Perform Primary Action', 'my-plugin' ) }
					</Button>
					<PinnedSidebars />
					<MoreMenu>
						{ () => (
							<>
								<MoreMenu.MenuGroup label={ _x( 'View', 'noun', 'my-plugin' ) }>
									<MoreMenu.DistractionFreePreferenceToggleMenuItem />
								</MoreMenu.MenuGroup>
								<MoreMenu.MenuGroup label={ __( 'Tools', 'my-plugin' ) }>
									<MoreMenu.KeyboardShortcutsMenuItem />
									<MoreMenu.ExternalLinkMenuItem
										href="https://my-plugin-website.com"
									>
										{ __( 'Learn more', 'my-plugin' ) }
									</MoreMenu.ExternalLinkMenuItem>
								</MoreMenu.MenuGroup>
							</>
						) }
					</MoreMenu>
				</HeaderActions>
			</Header>

			<div className="my-plugin-content">
				<p>{ __( 'Main content goes here.', 'my-plugin' ) }</p>
			</div>

			<Sidebar
				identifier="primary-sidebar"
				title={ __( 'Primary sidebar', 'my-plugin' ) }
				icon={ isRTL() ? drawerLeft : drawerRight }
				isPinnable={ true }
				isActiveByDefault
			>
				<p>{ __( 'Sidebar content goes here.', 'my-plugin' ) }</p>
			</Sidebar>

			<Footer>
				<p>{ __( 'Version 1.0', 'my-plugin' ) }</p>
			</Footer>
		</App>
	);
}
```

## Localization

As seen above, the `App` component requires a `labels` prop to provide localized strings for the interface regions and the keyboard shortcuts modal.

Additionally, it supports a `shortcutsDescriptions` prop to provide localized strings for the descriptions for the default keyboard shortcuts available.

Here is a full list of the labels and keyboard shortcut descriptions supported. It is recommended you provide all of these to ensure your plugin's UI can be properly translated.

```tsx
import { App } from 'wp-interface';
import { __ } from '@wordpress/i18n';

function MyPluginScreen() {
	const labels = {
		// Passed to InterfaceSkeleton (ARIA labels for regions)
		header: __( 'Header', 'my-plugin' ),
		body: __( 'Content', 'my-plugin' ),
		sidebar: __( 'Settings Sidebar', 'my-plugin' ),
		actions: __( 'Actions', 'my-plugin' ),
		footer: __( 'Footer', 'my-plugin' ),

		// Passed to App/KeyboardShortcutsHelpModal
		keyboardShortcutsModalTitle: __( 'Keyboard Shortcuts', 'my-plugin' ),
		keyboardShortcutsModalCloseButtonLabel: __( 'Close keyboard shortcuts modal', 'my-plugin' ),
		keyboardShortcutsGlobalSectionTitle: __( 'Global shortcuts', 'my-plugin' ),
	};

	const shortcutsDescriptions = {
		'keyboard-shortcuts': __(
			'Display these keyboard shortcuts.',
			'my-plugin'
		),
		'next-region': __(
			'Navigate to the next part of the screen.',
			'my-plugin'
		),
		'previous-region': __(
			'Navigate to the previous part of the screen.',
			'my-plugin'
		),
		'toggle-distraction-free': __(
			'Toggle distraction free mode.',
			'my-plugin'
		),
		'toggle-sidebar': __(
			'Show or hide the sidebar.',
			'my-plugin'
		),
	};

	return (
		<App
			scope="my-plugin"
			labels={ labels }
			shortcutsDescriptions={ shortcutsDescriptions }
		>
			{ /* Actual UI... */ }
		</App>
	);
}
```

Additionally, the `MoreMenu`, `MoreMenu.DistractionFreePreferenceToggleMenuItem`, and `MoreMenu.KeyboardShortcutsMenuItem` components also support specific props that help with localization. It is recommended you pass localized strings for the relevant props as well.

## Contributing

Contributions to the `wp-interface` package are welcome. It is being developed in a monorepo alongside my other WordPress NPM packages. Please review the [contributing guidelines](https://github.com/felixarntz/wp-packages/blob/main/CONTRIBUTING.md) to learn more about how you can contribute.
