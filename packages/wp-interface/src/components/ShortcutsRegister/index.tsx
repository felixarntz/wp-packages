import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import { useInterfaceScope } from '../InterfaceScopeProvider';
import { useHasSidebar } from '../Sidebar';
import type { ShortcutsRegisterProps } from './types';

type ShortcutDescriptions = Exclude<
	ShortcutsRegisterProps[ 'descriptions' ],
	undefined
>;

const EMPTY_DESCRIPTIONS: ShortcutDescriptions = {};

const DEFAULT_DESCRIPTIONS: ShortcutDescriptions = {
	'keyboard-shortcuts': 'Display these keyboard shortcuts.',
	'next-region': 'Navigate to the next part of the screen.',
	'previous-region': 'Navigate to the previous part of the screen.',
	'toggle-distraction-free': 'Toggle distraction free mode.',
	'toggle-sidebar': 'Show or hide the sidebar.',
};

const getDescription = (
	shortcutName: string,
	descriptions: ShortcutDescriptions
) => {
	return (
		descriptions[ shortcutName ] ||
		DEFAULT_DESCRIPTIONS[ shortcutName ] ||
		''
	);
};

/**
 * Renders a utility component to register general keyboard shortcuts for the application.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function ShortcutsRegister( props: ShortcutsRegisterProps ) {
	const { descriptions = EMPTY_DESCRIPTIONS } = props;
	const scope = useInterfaceScope();
	const hasSidebar = useHasSidebar();

	// Registering the shortcuts.
	const { registerShortcut } = useDispatch( keyboardShortcutsStore );
	useEffect( () => {
		registerShortcut( {
			name: `${ scope }/keyboard-shortcuts`,
			category: 'main',
			description: getDescription( 'keyboard-shortcuts', descriptions ),
			keyCombination: {
				modifier: 'access',
				character: 'h',
			},
		} );

		registerShortcut( {
			name: `${ scope }/next-region`,
			category: 'global',
			description: getDescription( 'next-region', descriptions ),
			keyCombination: {
				modifier: 'ctrl',
				character: '`',
			},
			aliases: [
				{
					modifier: 'access',
					character: 'n',
				},
			],
		} );

		registerShortcut( {
			name: `${ scope }/previous-region`,
			category: 'global',
			description: getDescription( 'previous-region', descriptions ),
			keyCombination: {
				modifier: 'ctrlShift',
				character: '`',
			},
			aliases: [
				{
					modifier: 'access',
					character: 'p',
				},
				{
					modifier: 'ctrlShift',
					character: '~',
				},
			],
		} );

		registerShortcut( {
			name: `${ scope }/toggle-distraction-free`,
			category: 'global',
			description: getDescription(
				'toggle-distraction-free',
				descriptions
			),
			keyCombination: {
				modifier: 'primaryShift',
				character: '\\',
			},
		} );

		if ( hasSidebar ) {
			registerShortcut( {
				name: `${ scope }/toggle-sidebar`,
				category: 'global',
				description: getDescription( 'toggle-sidebar', descriptions ),
				keyCombination: {
					modifier: 'primaryShift',
					character: ',',
				},
			} );
		}
	}, [ registerShortcut, descriptions, scope, hasSidebar ] );

	return null;
}
