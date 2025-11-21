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
	 * @param panelId - Panel identifier.
	 * @returns Action creator.
	 */
	openPanel( panelId: string ) {
		return ( { registry }: DispatcherArgs ) => {
			const activePanels =
				registry
					.select( preferencesStore )
					.get( 'ai-services', 'activePanels' ) ?? [];
			if ( activePanels.includes( panelId ) ) {
				return;
			}
			registry
				.dispatch( preferencesStore )
				.set( 'ai-services', 'activePanels', [
					...activePanels,
					panelId,
				] );
		};
	},

	/**
	 * Closes a panel.
	 *
	 * @param panelId - Panel identifier.
	 * @returns Action creator.
	 */
	closePanel( panelId: string ) {
		return ( { registry }: DispatcherArgs ) => {
			const activePanels =
				registry
					.select( preferencesStore )
					.get( 'ai-services', 'activePanels' ) ?? [];
			if (
				! Array.isArray( activePanels ) ||
				! activePanels.includes( panelId )
			) {
				return;
			}
			registry.dispatch( preferencesStore ).set(
				'ai-services',
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
	 * @param panelId - Panel identifier.
	 * @returns Action creator.
	 */
	togglePanel( panelId: string ) {
		return ( { dispatch, select }: DispatcherArgs ) => {
			if ( select.isPanelActive( panelId ) ) {
				dispatch.closePanel( panelId );
			} else {
				dispatch.openPanel( panelId );
			}
		};
	},
};

const selectors = {
	isPanelActive: createRegistrySelector(
		( select ) =>
			(
				_state: State,
				panelId: string,
				initialOpen: boolean = false
			) => {
				const activePanels = select( preferencesStore ).get(
					'ai-services',
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
