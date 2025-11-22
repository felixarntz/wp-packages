import { MenuItem } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { store as interfaceStore } from '../../store';
import type { KeyboardShortcutsMenuItemProps } from './types';

const DEFAULT_LABELS = {
	menuItemLabel: 'Keyboard shortcuts',
};

/**
 * Renders a menu item to open the keyboard shortcuts help modal.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function KeyboardShortcutsMenuItem(
	props: KeyboardShortcutsMenuItemProps = {}
) {
	const { labels } = props;
	const { openModal } = useDispatch( interfaceStore );
	const shortcut = useSelect(
		( select ) =>
			select( keyboardShortcutsStore ).getShortcutRepresentation(
				'ai-services/keyboard-shortcuts',
				'display'
			),
		[]
	);

	if ( ! shortcut ) {
		return null;
	}

	return (
		<MenuItem
			onClick={ () =>
				openModal( 'ai-services', 'keyboard-shortcuts-help' )
			}
			shortcut={ shortcut }
		>
			{ labels?.menuItemLabel ?? DEFAULT_LABELS.menuItemLabel }
		</MenuItem>
	);
}
