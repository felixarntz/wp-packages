import clsx from 'clsx';
import { Fragment } from '@wordpress/element';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { useDispatch, useSelect } from '@wordpress/data';
import { displayShortcutList, shortcutAriaLabel } from '@wordpress/keycodes';
import type { WPKeycodeModifier } from '@wordpress/keycodes';
import { store as interfaceStore } from '../../store';
import { Modal } from '../Modal';
import { useInterfaceScope } from '../InterfaceScopeProvider';
import type {
	KeyCombinationProps,
	ShortcutProps,
	ShortcutListProps,
	ShortcutSectionProps,
	ShortcutCategorySectionProps,
	KeyboardShortcutsHelpModalProps,
} from './types';

const DEFAULT_LABELS = {
	modalTitle: 'Keyboard shortcuts',
	modalCloseButtonLabel: 'Close keyboard shortcuts modal',
	globalSectionTitle: 'Global shortcuts',
};

/**
 * Renders a shortcut key combination.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function KeyCombination( props: KeyCombinationProps ) {
	const { keyCombination } = props;

	const shortcut = keyCombination.modifier
		? displayShortcutList[ keyCombination.modifier as WPKeycodeModifier ](
				keyCombination.character
		  )
		: keyCombination.character;
	const ariaLabel = keyCombination.modifier
		? shortcutAriaLabel[ keyCombination.modifier as WPKeycodeModifier ](
				keyCombination.character
		  )
		: keyCombination.character;

	return (
		<kbd
			className="editor-keyboard-shortcut-help-modal__shortcut-key-combination"
			aria-label={ ariaLabel }
		>
			{ ( Array.isArray( shortcut ) ? shortcut : [ shortcut ] ).map(
				( character, index ) => {
					if ( character === '+' ) {
						return <Fragment key={ index }>{ character }</Fragment>;
					}

					return (
						<kbd
							key={ index }
							className="editor-keyboard-shortcut-help-modal__shortcut-key"
						>
							{ character }
						</kbd>
					);
				}
			) }
		</kbd>
	);
}

/**
 * Renders a shortcut.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function Shortcut( props: ShortcutProps ) {
	const { name } = props;

	const { keyCombination, description, aliases } = useSelect(
		( select ) => {
			const {
				getShortcutKeyCombination,
				getShortcutDescription,
				getShortcutAliases,
			} = select( keyboardShortcutsStore );

			return {
				keyCombination: getShortcutKeyCombination( name ),
				aliases: getShortcutAliases( name ),
				description: getShortcutDescription( name ),
			};
		},
		[ name ]
	);

	if ( ! keyCombination ) {
		return null;
	}

	return (
		<>
			<div className="editor-keyboard-shortcut-help-modal__shortcut-description">
				{ description }
			</div>
			<div className="editor-keyboard-shortcut-help-modal__shortcut-term">
				<KeyCombination keyCombination={ keyCombination } />
				{ Array.isArray( aliases ) &&
					aliases.map( ( alias, index ) => (
						<KeyCombination
							keyCombination={ alias }
							key={ index }
						/>
					) ) }
			</div>
		</>
	);
}

/**
 * Renders a list of shortcuts.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function ShortcutList( props: ShortcutListProps ) {
	const { shortcuts } = props;

	return (
		/*
		 * Disable reason: The `list` ARIA role is redundant but
		 * Safari+VoiceOver won't announce the list otherwise.
		 */
		/* eslint-disable jsx-a11y/no-redundant-roles */
		<ul
			className="editor-keyboard-shortcut-help-modal__shortcut-list"
			role="list"
		>
			{ shortcuts.map( ( shortcut, index ) => (
				<li
					className="editor-keyboard-shortcut-help-modal__shortcut"
					key={ index }
				>
					<Shortcut name={ shortcut } />
				</li>
			) ) }
		</ul>
		/* eslint-enable jsx-a11y/no-redundant-roles */
	);
}

/**
 * Renders a section for a group of shortcuts.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function ShortcutSection( props: ShortcutSectionProps ) {
	const { shortcuts, title, className } = props;

	return (
		<section
			className={ clsx(
				'editor-keyboard-shortcut-help-modal__section',
				className
			) }
		>
			{ !! title && (
				<h2 className="editor-keyboard-shortcut-help-modal__section-title">
					{ title }
				</h2>
			) }
			<ShortcutList shortcuts={ shortcuts } />
		</section>
	);
}

/**
 * Renders a section for a category of shortcuts.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function ShortcutCategorySection( props: ShortcutCategorySectionProps ) {
	const { categoryName, title } = props;

	const categoryShortcuts = useSelect(
		( select ) => {
			return select( keyboardShortcutsStore ).getCategoryShortcuts(
				categoryName
			);
		},
		[ categoryName ]
	);

	return <ShortcutSection title={ title } shortcuts={ categoryShortcuts } />;
}

/**
 * Renders the modal displaying the available keyboard shortcuts.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function KeyboardShortcutsHelpModal(
	props: KeyboardShortcutsHelpModalProps = {}
) {
	const { labels } = props;
	const scope = useInterfaceScope();
	const { toggleModal } = useDispatch( interfaceStore );

	useShortcut( `${ scope }/keyboard-shortcuts`, () =>
		toggleModal( scope, 'keyboard-shortcuts-help' )
	);

	return (
		<Modal
			identifier="keyboard-shortcuts-help"
			title={ labels?.modalTitle ?? DEFAULT_LABELS.modalTitle }
			closeButtonLabel={
				labels?.modalCloseButtonLabel ??
				DEFAULT_LABELS.modalCloseButtonLabel
			}
			className="editor-keyboard-shortcut-help-modal"
		>
			<ShortcutCategorySection categoryName="main" />
			<ShortcutCategorySection
				title={
					labels?.globalSectionTitle ??
					DEFAULT_LABELS.globalSectionTitle
				}
				categoryName="global"
			/>
		</Modal>
	);
}
