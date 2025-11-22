/**
 * Internal dependencies
 */
import type { InterfaceProps } from '../Interface/types';
import type { InterfaceScopeProviderProps } from '../InterfaceScopeProvider/types';
import type { KeyboardShortcutsHelpModalProps } from '../KeyboardShortcutsHelpModal/types';
import type { ShortcutsRegisterProps } from '../ShortcutsRegister/types';

export type AppProps = InterfaceScopeProviderProps &
	InterfaceProps & {
		labels?: {
			keyboardShortcutsModalTitle?: Exclude<
				KeyboardShortcutsHelpModalProps[ 'labels' ],
				undefined
			>[ 'modalTitle' ];
			keyboardShortcutsGlobalSectionTitle?: Exclude<
				KeyboardShortcutsHelpModalProps[ 'labels' ],
				undefined
			>[ 'globalSectionTitle' ];
		};
	} & {
		shortcutsDescriptions?: ShortcutsRegisterProps[ 'descriptions' ];
	};
