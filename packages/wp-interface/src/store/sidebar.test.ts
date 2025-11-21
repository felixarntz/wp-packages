import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { store as interfaceStore } from '@wordpress/interface';
import type { createRegistry, createRegistrySelector } from '@wordpress/data';
import {
	storeConfig,
	ActionType,
	type ActionCreators,
	type Selectors,
	type CombinedAction,
	type State,
} from './sidebar';

type WPDataRegistry = ReturnType< typeof createRegistry >;
type RegistrySelector = ReturnType< typeof createRegistrySelector >;

// Needs to be mocked here to avoid having to mock DOM specific code loaded by @wordpress/interface.
vi.mock( '@wordpress/interface', () => ( {
	store: {
		name: 'core/interface',
	},
} ) );

vi.mock( '@wordpress/data', async ( importOriginal ) => {
	const actual = await importOriginal< typeof import('@wordpress/data') >();
	return {
		...actual,
		createRegistrySelector: vi.fn( ( factory ) => factory ),
	};
} );

describe( 'sidebar store', () => {
	let mockRegistry: WPDataRegistry;
	let mockSelectors: { [ K in keyof Selectors ]: Mock };
	let mockDispatchers: { [ K in keyof ActionCreators ]: Mock } & ( (
		action: CombinedAction
	) => void );
	let mockInterfaceSelectors: { getActiveComplementaryArea: Mock };
	let mockInterfaceDispatchers: {
		enableComplementaryArea: Mock;
		disableComplementaryArea: Mock;
	};

	beforeEach( () => {
		mockInterfaceSelectors = {
			getActiveComplementaryArea: vi.fn(),
		};
		mockInterfaceDispatchers = {
			enableComplementaryArea: vi.fn(),
			disableComplementaryArea: vi.fn(),
		};
		mockRegistry = {
			select: vi.fn( ( store ) => {
				if ( store === interfaceStore ) {
					return mockInterfaceSelectors;
				}
				return {};
			} ),
			dispatch: vi.fn( ( store ) => {
				if ( store === interfaceStore ) {
					return mockInterfaceDispatchers;
				}
				return {};
			} ),
			subscribe: vi.fn(),
			registerStore: vi.fn(),
			registerGenericStore: vi.fn(),
		} as unknown as WPDataRegistry;

		mockSelectors = {
			getActiveSidebar: vi.fn(),
			isSidebarActive: vi.fn(),
			getDefaultSidebar: vi.fn(),
		};

		mockDispatchers = Object.assign( vi.fn(), {
			openSidebar: vi.fn(),
			closeSidebar: vi.fn(),
			toggleSidebar: vi.fn(),
			toggleDefaultSidebar: vi.fn(),
			setDefaultSidebar: vi.fn(),
		} );
	} );

	describe( 'reducer', () => {
		it( 'returns the initial state', () => {
			const state = storeConfig.reducer!(
				undefined as unknown as State,
				{} as CombinedAction
			);
			expect( state ).toEqual( {
				defaultSidebarId: false,
			} );
		} );

		it( 'sets the default sidebar', () => {
			const state = storeConfig.reducer!( undefined as unknown as State, {
				type: ActionType.SetDefaultSidebar,
				payload: { sidebarId: 'test-sidebar' },
			} );
			expect( state ).toEqual( {
				defaultSidebarId: 'test-sidebar',
			} );
		} );
	} );

	describe( 'selectors', () => {
		describe( 'getActiveSidebar', () => {
			it( 'calls the interface store selector with correct arguments', () => {
				const mockSelect = vi.fn( () => mockInterfaceSelectors );
				const selector = (
					storeConfig.selectors!
						.getActiveSidebar as unknown as RegistrySelector
				 )( mockSelect );

				mockInterfaceSelectors.getActiveComplementaryArea.mockReturnValue(
					'test-sidebar'
				);

				const result = selector();

				expect( mockSelect ).toHaveBeenCalledWith( interfaceStore );
				expect(
					mockInterfaceSelectors.getActiveComplementaryArea
				).toHaveBeenCalledWith( 'ai-services' );
				expect( result ).toBe( 'test-sidebar' );
			} );
		} );

		describe( 'isSidebarActive', () => {
			it( 'returns true if the sidebar is active', () => {
				const mockSelect = vi.fn( () => mockInterfaceSelectors );
				const selector = (
					storeConfig.selectors!
						.isSidebarActive as unknown as RegistrySelector
				 )( mockSelect );

				mockInterfaceSelectors.getActiveComplementaryArea.mockReturnValue(
					'test-sidebar'
				);

				const result = selector( {} as State, 'test-sidebar' );

				expect( mockSelect ).toHaveBeenCalledWith( interfaceStore );
				expect(
					mockInterfaceSelectors.getActiveComplementaryArea
				).toHaveBeenCalledWith( 'ai-services' );
				expect( result ).toBe( true );
			} );

			it( 'returns false if the sidebar is not active', () => {
				const mockSelect = vi.fn( () => mockInterfaceSelectors );
				const selector = (
					storeConfig.selectors!
						.isSidebarActive as unknown as RegistrySelector
				 )( mockSelect );

				mockInterfaceSelectors.getActiveComplementaryArea.mockReturnValue(
					'other-sidebar'
				);

				const result = selector( {} as State, 'test-sidebar' );

				expect( result ).toBe( false );
			} );
		} );

		describe( 'getDefaultSidebar', () => {
			it( 'returns the default sidebar id', () => {
				const state: State = { defaultSidebarId: 'test-sidebar' };
				const result =
					storeConfig.selectors!.getDefaultSidebar( state );
				expect( result ).toBe( 'test-sidebar' );
			} );
		} );
	} );

	describe( 'actions', () => {
		describe( 'openSidebar', () => {
			it( 'dispatches enableComplementaryArea to interface store', () => {
				const thunk =
					storeConfig.actions!.openSidebar( 'test-sidebar' );
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockRegistry.dispatch ).toHaveBeenCalledWith(
					interfaceStore
				);
				expect(
					mockInterfaceDispatchers.enableComplementaryArea
				).toHaveBeenCalledWith( 'ai-services', 'test-sidebar' );
			} );
		} );

		describe( 'closeSidebar', () => {
			it( 'dispatches disableComplementaryArea to interface store', () => {
				const thunk = storeConfig.actions!.closeSidebar();
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockRegistry.dispatch ).toHaveBeenCalledWith(
					interfaceStore
				);
				expect(
					mockInterfaceDispatchers.disableComplementaryArea
				).toHaveBeenCalledWith( 'ai-services' );
			} );
		} );

		describe( 'toggleSidebar', () => {
			it( 'closes sidebar if it is active', () => {
				mockSelectors.isSidebarActive.mockReturnValue( true );

				const thunk =
					storeConfig.actions!.toggleSidebar( 'test-sidebar' );
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.isSidebarActive ).toHaveBeenCalledWith(
					'test-sidebar'
				);
				expect( mockDispatchers.closeSidebar ).toHaveBeenCalled();
				expect( mockDispatchers.openSidebar ).not.toHaveBeenCalled();
			} );

			it( 'opens sidebar if it is not active', () => {
				mockSelectors.isSidebarActive.mockReturnValue( false );

				const thunk =
					storeConfig.actions!.toggleSidebar( 'test-sidebar' );
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.isSidebarActive ).toHaveBeenCalledWith(
					'test-sidebar'
				);
				expect( mockDispatchers.openSidebar ).toHaveBeenCalledWith(
					'test-sidebar'
				);
				expect( mockDispatchers.closeSidebar ).not.toHaveBeenCalled();
			} );
		} );

		describe( 'toggleDefaultSidebar', () => {
			it( 'closes sidebar if any sidebar is active', () => {
				mockSelectors.getActiveSidebar.mockReturnValue(
					'some-sidebar'
				);

				const thunk = storeConfig.actions!.toggleDefaultSidebar();
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.getActiveSidebar ).toHaveBeenCalled();
				expect( mockDispatchers.closeSidebar ).toHaveBeenCalled();
				expect( mockDispatchers.openSidebar ).not.toHaveBeenCalled();
			} );

			it( 'opens default sidebar if no sidebar is active', () => {
				mockSelectors.getActiveSidebar.mockReturnValue( null );
				mockSelectors.getDefaultSidebar.mockReturnValue(
					'default-sidebar'
				);

				const thunk = storeConfig.actions!.toggleDefaultSidebar();
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.getActiveSidebar ).toHaveBeenCalled();
				expect( mockSelectors.getDefaultSidebar ).toHaveBeenCalled();
				expect( mockDispatchers.openSidebar ).toHaveBeenCalledWith(
					'default-sidebar'
				);
				expect( mockDispatchers.closeSidebar ).not.toHaveBeenCalled();
			} );

			it( 'does nothing if no sidebar is active and no default sidebar is set', () => {
				mockSelectors.getActiveSidebar.mockReturnValue( null );
				mockSelectors.getDefaultSidebar.mockReturnValue( false );

				const thunk = storeConfig.actions!.toggleDefaultSidebar();
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.getActiveSidebar ).toHaveBeenCalled();
				expect( mockSelectors.getDefaultSidebar ).toHaveBeenCalled();
				expect( mockDispatchers.openSidebar ).not.toHaveBeenCalled();
				expect( mockDispatchers.closeSidebar ).not.toHaveBeenCalled();
			} );
		} );

		describe( 'setDefaultSidebar', () => {
			it( 'dispatches SetDefaultSidebar action', () => {
				const thunk =
					storeConfig.actions!.setDefaultSidebar( 'test-sidebar' );
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockDispatchers ).toHaveBeenCalledWith( {
					type: ActionType.SetDefaultSidebar,
					payload: { sidebarId: 'test-sidebar' },
				} );
			} );
		} );
	} );
} );
