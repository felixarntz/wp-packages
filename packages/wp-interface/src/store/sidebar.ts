import { createRegistrySelector } from '@wordpress/data';
import { store as interfaceStore } from '@wordpress/interface';
import type {
	StoreConfig,
	Action,
	ThunkArgs,
} from '@felixarntz/wp-store-utils';

export enum ActionType {
	Unknown = 'REDUX_UNKNOWN',
	SetDefaultSidebar = 'SET_DEFAULT_SIDEBAR',
}

type UnknownAction = Action< ActionType.Unknown >;
type SetDefaultSidebarAction = Action<
	ActionType.SetDefaultSidebar,
	{ scope: string; sidebarId: string }
>;

export type CombinedAction = UnknownAction | SetDefaultSidebarAction;

export type State = {
	defaultSidebarIds: Record< string, string | false >;
};

export type ActionCreators = typeof actions;
export type Selectors = typeof selectors;

type DispatcherArgs = ThunkArgs<
	State,
	ActionCreators,
	CombinedAction,
	Selectors
>;

const initialState: State = {
	defaultSidebarIds: {},
};

const actions = {
	/**
	 * Opens a sidebar.
	 *
	 * @param scope      - Scope identifier.
	 * @param sidebarId - Sidebar identifier.
	 * @returns Action creator.
	 */
	openSidebar( scope: string, sidebarId: string ) {
		return ( { registry }: DispatcherArgs ) => {
			registry
				.dispatch( interfaceStore )
				.enableComplementaryArea( scope, sidebarId );
		};
	},

	/**
	 * Closes the currently open sidebar (if any).
	 *
	 * @param scope - Scope identifier.
	 * @returns Action creator.
	 */
	closeSidebar( scope: string ) {
		return ( { registry }: DispatcherArgs ) => {
			registry
				.dispatch( interfaceStore )
				.disableComplementaryArea( scope );
		};
	},

	/**
	 * Toggles a sidebar.
	 *
	 * If the sidebar is active, it will be closed.
	 * If the sidebar is closed or another sidebar is active, it will be opened.
	 *
	 * @param scope     - Scope identifier.
	 * @param sidebarId - Sidebar identifier.
	 * @returns Action creator.
	 */
	toggleSidebar( scope: string, sidebarId: string ) {
		return ( { dispatch, select }: DispatcherArgs ) => {
			if ( select.isSidebarActive( scope, sidebarId ) ) {
				dispatch.closeSidebar( scope );
			} else {
				dispatch.openSidebar( scope, sidebarId );
			}
		};
	},

	/**
	 * Toggles the default sidebar.
	 *
	 * If a sidebar is active, it will be closed.
	 * If no sidebar is active, the default sidebar will be opened.
	 *
	 * @param scope - Scope identifier.
	 * @returns Action creator.
	 */
	toggleDefaultSidebar( scope: string ) {
		return ( { dispatch, select }: DispatcherArgs ) => {
			if ( select.getActiveSidebar( scope ) ) {
				dispatch.closeSidebar( scope );
			} else {
				const defaultSidebarId = select.getDefaultSidebar( scope );
				if ( ! defaultSidebarId ) {
					return;
				}
				dispatch.openSidebar( scope, defaultSidebarId );
			}
		};
	},

	/**
	 * Sets the default sidebar.
	 *
	 * @param scope     - Scope identifier.
	 * @param sidebarId - Sidebar identifier.
	 * @returns Action creator.
	 */
	setDefaultSidebar( scope: string, sidebarId: string ) {
		return ( { dispatch }: DispatcherArgs ) => {
			dispatch( {
				type: ActionType.SetDefaultSidebar,
				payload: {
					scope,
					sidebarId,
				},
			} );
		};
	},
};

/**
 * Reducer for the store mutations.
 *
 * @param state  - Current state.
 * @param action - Action object.
 * @returns New state.
 */
function reducer( state: State = initialState, action: CombinedAction ): State {
	switch ( action.type ) {
		case ActionType.SetDefaultSidebar: {
			const { scope, sidebarId } = action.payload;
			return {
				...state,
				defaultSidebarIds: {
					...state.defaultSidebarIds,
					[ scope ]: sidebarId,
				},
			};
		}
	}

	return state;
}

const selectors = {
	getActiveSidebar: createRegistrySelector(
		( select ) => ( _state: State, scope: string ) => {
			return select( interfaceStore ).getActiveComplementaryArea( scope );
		}
	),

	isSidebarActive: createRegistrySelector(
		( select ) => ( _state: State, scope: string, sidebarId: string ) => {
			return (
				select( interfaceStore ).getActiveComplementaryArea( scope ) ===
				sidebarId
			);
		}
	),

	getDefaultSidebar: ( state: State, scope: string ) => {
		return state.defaultSidebarIds[ scope ] || false;
	},
};

export const storeConfig: StoreConfig<
	State,
	ActionCreators,
	CombinedAction,
	Selectors
> = {
	initialState,
	actions,
	reducer,
	selectors,
};
