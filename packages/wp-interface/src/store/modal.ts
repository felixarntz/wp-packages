import { createRegistrySelector } from '@wordpress/data';
import { store as interfaceStore } from '@wordpress/interface';
import type { StoreConfig, Action, ThunkArgs } from 'wp-store-utils';

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
	 * @param scope - Modal scope.
	 * @param modalId - Modal identifier.
	 * @returns Action creator.
	 */
	openModal( scope: string, modalId: string ) {
		return ( { registry }: DispatcherArgs ) => {
			registry
				.dispatch( interfaceStore )
				.openModal( `${ scope }/${ modalId }` );
		};
	},

	/**
	 * Closes the currently open modal.
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
	 * @param scope - Modal scope.
	 * @param modalId - Modal identifier.
	 * @returns Action creator.
	 */
	toggleModal( scope: string, modalId: string ) {
		return ( { dispatch, select }: DispatcherArgs ) => {
			if ( select.isModalActive( scope, modalId ) ) {
				dispatch.closeModal();
			} else {
				dispatch.openModal( scope, modalId );
			}
		};
	},
};

const selectors = {
	isModalActive: createRegistrySelector(
		( select ) => ( _state: State, scope: string, modalId: string ) => {
			return select( interfaceStore ).isModalActive(
				`${ scope }/${ modalId }`
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
