import { useSelect } from '@wordpress/data';
import { PreferenceToggleMenuItem } from '@wordpress/preferences';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { useInterfaceScope } from '../InterfaceScopeProvider';
import type { DistractionFreePreferenceToggleMenuItemProps } from './types';

const DEFAULT_LABELS = {
	menuItemLabel: 'Distraction free',
	menuItemInfo: 'Hide secondary interface to help focus',
	messageActivated: 'Distraction free mode activated',
	messageDeactivated: 'Distraction free mode deactivated',
};

/**
 * Renders a menu item to toggle the distraction free mode for the application.
 *
 * By default, distraction free mode is disabled and can only be enabled via shortcut.
 * This component can be rendered in any menu to allow users to toggle the distraction free mode intuitively in the UI.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function DistractionFreePreferenceToggleMenuItem(
	props: DistractionFreePreferenceToggleMenuItemProps = {}
) {
	const {
		menuItemLabel,
		menuItemInfo,
		messageActivated,
		messageDeactivated,
	} = props;
	const scope = useInterfaceScope();
	const shortcut = useSelect(
		( select ) =>
			select( keyboardShortcutsStore ).getShortcutRepresentation(
				`${ scope }/toggle-distraction-free`,
				'display'
			),
		[ scope ]
	);

	if ( ! shortcut ) {
		return null;
	}

	return (
		<PreferenceToggleMenuItem
			scope={ scope }
			name="distractionFree"
			label={ menuItemLabel ?? DEFAULT_LABELS.menuItemLabel }
			info={ menuItemInfo ?? DEFAULT_LABELS.menuItemInfo }
			messageActivated={
				messageActivated ?? DEFAULT_LABELS.messageActivated
			}
			messageDeactivated={
				messageDeactivated ?? DEFAULT_LABELS.messageDeactivated
			}
			shortcut={ shortcut }
		/>
	);
}
