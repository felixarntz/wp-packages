import { createRegistrySelector } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';
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
	 * Sets a preference.
	 *
	 * @param scope - Scope identifier.
	 * @param name  - Preference name.
	 * @param value - Preference value.
	 * @returns Action creator.
	 */
	setPreference( scope: string, name: string, value: unknown ) {
		return ( { registry }: DispatcherArgs ) => {
			registry.dispatch( preferencesStore ).set( scope, name, value );
		};
	},

	/**
	 * Toggles a preference.
	 *
	 * @param scope - Scope identifier.
	 * @param name  - Preference name.
	 * @returns Action creator.
	 */
	togglePreference( scope: string, name: string ) {
		return ( { registry, select }: DispatcherArgs ) => {
			const currentValue = select.getPreference( scope, name );
			registry
				.dispatch( preferencesStore )
				.set( scope, name, ! currentValue );
		};
	},
};

const selectors = {
	getPreference: createRegistrySelector(
		( select ) => ( _state: State, scope: string, name: string ) => {
			return select( preferencesStore ).get( scope, name );
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
