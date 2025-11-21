import { createRegistrySelector } from '@wordpress/data';
import { store as interfaceStore } from '@wordpress/interface';
import type {
	StoreConfig,
	Action,
	ThunkArgs,
} from '@felixarntz/wp-store-utils';

export enum ActionType {
	Unknown = 'REDUX_UNKNOWN',
}

type UnknownAction = Action< ActionType.Unknown >;

export type CombinedAction = UnknownAction;

export type State = Record< string, never >;

export type ActionCreators = typeof actions;
export type Selectors = typeof selectors;

type DispatcherArgs = ThunkArgs<
	State,
	ActionCreators,
	CombinedAction,
	Selectors
>;

const actions = {
	/**
	 * Opens a modal.
	 *
	 * @since 1.0.0
	 *
	 * @param modalId - Modal identifier.
	 * @returns Action creator.
	 */
	openModal( modalId: string ) {
		return ( { registry }: DispatcherArgs ) => {
			registry
				.dispatch( interfaceStore )
				.openModal( `ai-services/${ modalId }` );
		};
	},

	/**
	 * Closes the currently open modal.
	 *
	 * @since 1.0.0
	 *
	 * @returns Action creator.
	 */
	closeModal() {
		return ( { registry }: DispatcherArgs ) => {
			registry.dispatch( interfaceStore ).closeModal();
		};
	},

	/**
	 * Toggles a modal.
	 *
	 * If the modal is active, it will be closed.
	 * If the modal is closed or another modal is active, it will be opened.
	 *
	 * @since 1.0.0
	 *
	 * @param modalId - Modal identifier.
	 * @returns Action creator.
	 */
	toggleModal( modalId: string ) {
		return ( { dispatch, select }: DispatcherArgs ) => {
			if ( select.isModalActive( modalId ) ) {
				dispatch.closeModal();
			} else {
				dispatch.openModal( modalId );
			}
		};
	},
};

const selectors = {
	isModalActive: createRegistrySelector(
		( select ) => ( _state: State, modalId: string ) => {
			return select( interfaceStore ).isModalActive(
				`ai-services/${ modalId }`
			);
		}
	),
};

export const storeConfig: StoreConfig<
	State,
	ActionCreators,
	CombinedAction,
	Selectors
> = {
	actions,
	reducer: ( state: State ): State => state, // Empty reducer.
	selectors,
};
