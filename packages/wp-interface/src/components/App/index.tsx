import { SlotFillProvider } from '@wordpress/components';
import type { WordPressComponentProps } from '@wordpress/components/build-types/context';
import { ErrorBoundary } from '../ErrorBoundary';
import { Interface } from '../Interface';
import { InterfaceScopeProvider } from '../InterfaceScopeProvider';
import { ShortcutsRegister } from '../ShortcutsRegister';
import { KeyboardShortcutsHelpModal } from '../KeyboardShortcutsHelpModal';
import type { AppProps } from './types';

/**
 * Renders the root of the application.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function App( props: WordPressComponentProps< AppProps, null > ) {
	const { scope, className, labels, shortcutsDescriptions, children } = props;

	const {
		keyboardShortcutsModalTitle,
		keyboardShortcutsModalCloseButtonLabel,
		keyboardShortcutsGlobalSectionTitle,
		...interfaceLabels
	} = labels;

	return (
		<SlotFillProvider>
			<ErrorBoundary>
				<InterfaceScopeProvider scope={ scope }>
					<Interface
						className={ className }
						labels={ interfaceLabels }
					>
						{ children }
					</Interface>
					<ShortcutsRegister descriptions={ shortcutsDescriptions } />
					<KeyboardShortcutsHelpModal
						labels={ {
							modalTitle: keyboardShortcutsModalTitle,
							modalCloseButtonLabel:
								keyboardShortcutsModalCloseButtonLabel,
							globalSectionTitle:
								keyboardShortcutsGlobalSectionTitle,
						} }
					/>
				</InterfaceScopeProvider>
			</ErrorBoundary>
		</SlotFillProvider>
	);
}
