import { useSelect } from '@wordpress/data';
import { external, moreVertical } from '@wordpress/icons';
import {
	MenuGroup,
	MenuItem,
	VisuallyHidden,
	DropdownMenu,
} from '@wordpress/components';
import { createContext, useContext } from '@wordpress/element';
import { store as preferencesStore } from '@wordpress/preferences';
import { useInterfaceScope } from '../InterfaceScopeProvider';
import { DistractionFreePreferenceToggleMenuItem } from './DistractionFreePreferenceToggleMenuItem';
import { KeyboardShortcutsMenuItem } from './KeyboardShortcutsMenuItem';
import type { LinkMenuItemProps, MoreMenuProps } from './types';

const ExternalLinkA11yTextContext = createContext< string >(
	'(opens in a new tab)'
);
const { Provider: ExternalLinkA11yTextProvider } = ExternalLinkA11yTextContext;

/**
 * Renders a menu item as an internal link.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function InternalLinkMenuItem( props: LinkMenuItemProps ) {
	const { href, children } = props;

	return (
		<MenuItem
			// @ts-expect-error This prop is valid, but is missing from the type definition.
			href={ href }
		>
			{ children }
		</MenuItem>
	);
}

/**
 * Renders a menu item as an external link.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function ExternalLinkMenuItem( props: LinkMenuItemProps ) {
	const { href, children } = props;
	const externalLinkA11yHint = useContext( ExternalLinkA11yTextContext );

	return (
		<MenuItem
			icon={ external }
			// @ts-expect-error This prop is valid, but is missing from the type definition.
			href={ href }
			target="_blank"
			rel="noopener noreferrer"
		>
			{ children }
			<VisuallyHidden as="span">{ externalLinkA11yHint }</VisuallyHidden>
		</MenuItem>
	);
}

/**
 * Renders the More menu, typically displayed in the header of interface.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function InternalMoreMenu( props: MoreMenuProps ) {
	const { menuLabel, externalLinkA11yHint, children } = props;

	const scope = useInterfaceScope();
	const showIconLabels = useSelect(
		( select ) => select( preferencesStore ).get( scope, 'showIconLabels' ),
		[]
	);

	return (
		<ExternalLinkA11yTextProvider
			value={ externalLinkA11yHint || '(opens in a new tab)' }
		>
			<DropdownMenu
				icon={ moreVertical }
				label={ menuLabel || 'Options' }
				popoverProps={ {
					placement: 'bottom-end',
					className: 'more-menu-dropdown__content',
				} }
				toggleProps={ {
					showTooltip: ! showIconLabels,
					...( showIconLabels ? { variant: 'tertiary' } : {} ),
					tooltipPosition: 'bottom',
					size: 'compact',
				} }
			>
				{ children }
			</DropdownMenu>
		</ExternalLinkA11yTextProvider>
	);
}

export const MoreMenu = Object.assign( InternalMoreMenu, {
	displayName: 'MoreMenu',
	MenuGroup,
	MenuItem,
	DistractionFreePreferenceToggleMenuItem,
	KeyboardShortcutsMenuItem,
	InternalLinkMenuItem,
	ExternalLinkMenuItem,
} );
