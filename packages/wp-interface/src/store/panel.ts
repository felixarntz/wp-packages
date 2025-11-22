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
	 * Opens a panel.
	 *
	 * @param scope - Scope identifier.
	 * @param panelId - Panel identifier.
	 * @returns Action creator.
	 */
	openPanel( scope: string, panelId: string ) {
		return ( { registry }: DispatcherArgs ) => {
			const activePanels =
				registry
					.select( preferencesStore )
					.get( scope, 'activePanels' ) ?? [];
			if ( activePanels.includes( panelId ) ) {
				return;
			}
			registry
				.dispatch( preferencesStore )
				.set( scope, 'activePanels', [ ...activePanels, panelId ] );
		};
	},

	/**
	 * Closes a panel.
	 *
	 * @param scope - Scope identifier.
	 * @param panelId - Panel identifier.
	 * @returns Action creator.
	 */
	closePanel( scope: string, panelId: string ) {
		return ( { registry }: DispatcherArgs ) => {
			const activePanels =
				registry
					.select( preferencesStore )
					.get( scope, 'activePanels' ) ?? [];
			if (
				! Array.isArray( activePanels ) ||
				! activePanels.includes( panelId )
			) {
				return;
			}
			registry.dispatch( preferencesStore ).set(
				scope,
				'activePanels',
				activePanels.filter(
					( activePanelId ) => activePanelId !== panelId
				)
			);
		};
	},

	/**
	 * Toggles a panel.
	 *
	 * If the panel is active, it will be closed.
	 * If the panel is closed, it will be opened.
	 *
	 * @param scope - Scope identifier.
	 * @param panelId - Panel identifier.
	 * @returns Action creator.
	 */
	togglePanel( scope: string, panelId: string ) {
		return ( { dispatch, select }: DispatcherArgs ) => {
			if ( select.isPanelActive( scope, panelId ) ) {
				dispatch.closePanel( scope, panelId );
			} else {
				dispatch.openPanel( scope, panelId );
			}
		};
	},
};

const selectors = {
	isPanelActive: createRegistrySelector(
		( select ) =>
			(
				_state: State,
				scope: string,
				panelId: string,
				initialOpen: boolean = false
			) => {
				const activePanels = select( preferencesStore ).get(
					scope,
					'activePanels'
				);
				if ( ! activePanels || ! Array.isArray( activePanels ) ) {
					return !! initialOpen;
				}
				return !! activePanels.includes( panelId );
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
