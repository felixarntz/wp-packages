import { SlotFillProvider } from '@wordpress/components';
import { ErrorBoundary } from '@wordpress/editor';
import type { WordPressComponentProps } from '@wordpress/components/build-types/context';
import { Interface } from '../Interface';
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
	const { className, labels, children } = props;

	return (
		<SlotFillProvider>
			<ErrorBoundary>
				<Interface className={ className } labels={ labels }>
					{ children }
				</Interface>
				<ShortcutsRegister />
				<KeyboardShortcutsHelpModal />
			</ErrorBoundary>
		</SlotFillProvider>
	);
}
