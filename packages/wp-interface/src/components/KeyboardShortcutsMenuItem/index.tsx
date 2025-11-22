import { __ } from '@wordpress/i18n';
import { MenuItem } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { store as interfaceStore } from '../../store';

/**
 * Renders a menu item to open the keyboard shortcuts help modal.
 *
 * @returns The component to be rendered.
 */
export function KeyboardShortcutsMenuItem() {
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
			{ __( 'Keyboard shortcuts', 'ai-services' ) }
		</MenuItem>
	);
}
