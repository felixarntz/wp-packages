import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { store as preferencesStore } from '@wordpress/preferences';
import type { createRegistry, createRegistrySelector } from '@wordpress/data';
import {
	storeConfig,
	type ActionCreators,
	type Selectors,
	type CombinedAction,
} from './panel';

type WPDataRegistry = ReturnType< typeof createRegistry >;
type RegistrySelector = ReturnType< typeof createRegistrySelector >;

vi.mock( '@wordpress/data', async ( importOriginal ) => {
	const actual = await importOriginal< typeof import('@wordpress/data') >();
	return {
		...actual,
		createRegistrySelector: vi.fn( ( factory ) => factory ),
	};
} );

describe( 'panel store', () => {
	let mockRegistry: WPDataRegistry;
	let mockSelectors: { [ K in keyof Selectors ]: Mock };
	let mockDispatchers: { [ K in keyof ActionCreators ]: Mock } & ( (
		action: CombinedAction
	) => void );
	let mockPreferencesSelectors: { get: Mock };
	let mockPreferencesDispatchers: { set: Mock };

	beforeEach( () => {
		mockPreferencesSelectors = {
			get: vi.fn(),
		};
		mockPreferencesDispatchers = {
			set: vi.fn(),
		};
		mockRegistry = {
			select: vi.fn( ( store ) => {
				if ( store === preferencesStore ) {
					return mockPreferencesSelectors;
				}
				return {};
			} ),
			dispatch: vi.fn( ( store ) => {
				if ( store === preferencesStore ) {
					return mockPreferencesDispatchers;
				}
				return {};
			} ),
			subscribe: vi.fn(),
			registerStore: vi.fn(),
			registerGenericStore: vi.fn(),
		} as WPDataRegistry;
		mockSelectors = {
			isPanelActive: vi.fn(),
		};
		mockDispatchers = Object.assign( vi.fn(), {
			closePanel: vi.fn( ( scope: string, panelId: string ) => {
				const thunk = storeConfig.actions!.closePanel( scope, panelId );
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );
			} ),
			openPanel: vi.fn( ( scope: string, panelId: string ) => {
				const thunk = storeConfig.actions!.openPanel( scope, panelId );
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );
			} ),
			togglePanel: vi.fn(),
		} );
	} );

	describe( 'selectors', () => {
		describe( 'isPanelActive', () => {
			it( 'returns initialOpen when activePanels is undefined', () => {
				const mockSelect = vi.fn( ( store ) => {
					if ( store === preferencesStore ) {
						return {
							get: vi.fn( () => undefined ),
						};
					}
					return {};
				} );
				const selector = (
					storeConfig.selectors!
						.isPanelActive as unknown as RegistrySelector
				 )( mockSelect );
				const result = selector( 'test-scope', {}, 'panel1', true );
				expect( result ).toBe( true );
			} );

			it( 'returns initialOpen when activePanels is not an array', () => {
				const mockSelect = vi.fn( ( store ) => {
					if ( store === preferencesStore ) {
						return {
							get: vi.fn( () => 'not-array' ),
						};
					}
					return {};
				} );
				const selector = (
					storeConfig.selectors!
						.isPanelActive as unknown as RegistrySelector
				 )( mockSelect );
				const result = selector( 'test-scope', {}, 'panel1', false );
				expect( result ).toBe( false );
			} );

			it( 'returns true when panelId is in activePanels', () => {
				const mockSelect = vi.fn( ( store ) => {
					if ( store === preferencesStore ) {
						return {
							get: vi.fn( () => [ 'panel1', 'panel2' ] ),
						};
					}
					return {};
				} );
				const selector = (
					storeConfig.selectors!
						.isPanelActive as unknown as RegistrySelector
				 )( mockSelect );
				const result = selector( 'test-scope', {}, 'panel1' );
				expect( result ).toBe( true );
			} );

			it( 'returns false when panelId is not in activePanels', () => {
				const mockSelect = vi.fn( ( store ) => {
					if ( store === preferencesStore ) {
						return {
							get: vi.fn( () => [ 'panel2' ] ),
						};
					}
					return {};
				} );
				const selector = (
					storeConfig.selectors!
						.isPanelActive as unknown as RegistrySelector
				 )( mockSelect );
				const result = selector( 'test-scope', {}, 'panel1' );
				expect( result ).toBe( false );
			} );

			it( 'returns false when activePanels is empty array and no initialOpen', () => {
				const mockSelect = vi.fn( ( store ) => {
					if ( store === preferencesStore ) {
						return {
							get: vi.fn( () => [] ),
						};
					}
					return {};
				} );
				const selector = (
					storeConfig.selectors!
						.isPanelActive as unknown as RegistrySelector
				 )( mockSelect );
				const result = selector( 'test-scope', {}, 'panel1' );
				expect( result ).toBe( false );
			} );
		} );
	} );

	describe( 'actions', () => {
		describe( 'openPanel', () => {
			it( 'does nothing if panel is already active', () => {
				const getMock = mockPreferencesSelectors.get;
				getMock.mockReturnValue( [ 'panel1' ] );
				const setMock = mockPreferencesDispatchers.set;

				const thunk = storeConfig.actions!.openPanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).not.toHaveBeenCalled();
			} );

			it( 'adds panel to activePanels if not active', () => {
				const getMock = mockPreferencesSelectors.get;
				getMock.mockReturnValue( [ 'panel2' ] );
				const setMock = mockPreferencesDispatchers.set;

				const thunk = storeConfig.actions!.openPanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel2', 'panel1' ]
				);
			} );

			it( 'adds panel when activePanels is undefined', () => {
				const getMock = mockRegistry.select( preferencesStore ).get;
				getMock.mockReturnValue( undefined );
				const setMock = mockRegistry.dispatch( preferencesStore ).set;

				const thunk = storeConfig.actions!.openPanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel1' ]
				);
			} );

			it( 'adds panel when activePanels is empty', () => {
				const getMock = mockRegistry.select( preferencesStore ).get;
				getMock.mockReturnValue( [] );
				const setMock = mockRegistry.dispatch( preferencesStore ).set;

				const thunk = storeConfig.actions!.openPanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel1' ]
				);
			} );
		} );

		describe( 'closePanel', () => {
			it( 'does nothing if activePanels is not an array', () => {
				const getMock = mockPreferencesSelectors.get;
				getMock.mockReturnValue( 'not-array' );
				const setMock = mockPreferencesDispatchers.set;

				const thunk = storeConfig.actions!.closePanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).not.toHaveBeenCalled();
			} );
			it( 'does nothing if panel is not active', () => {
				const getMock = mockRegistry.select( preferencesStore ).get;
				getMock.mockReturnValue( [ 'panel2' ] );
				const setMock = mockRegistry.dispatch( preferencesStore ).set;

				const thunk = storeConfig.actions!.closePanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).not.toHaveBeenCalled();
			} );

			it( 'removes panel from activePanels if active', () => {
				const getMock = mockRegistry.select( preferencesStore ).get;
				getMock.mockReturnValue( [ 'panel1', 'panel2' ] );
				const setMock = mockRegistry.dispatch( preferencesStore ).set;

				const thunk = storeConfig.actions!.closePanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel2' ]
				);
			} );

			it( 'removes only the specified panel', () => {
				const getMock = mockRegistry.select( preferencesStore ).get;
				getMock.mockReturnValue( [ 'panel1', 'panel2', 'panel3' ] );
				const setMock = mockRegistry.dispatch( preferencesStore ).set;

				const thunk = storeConfig.actions!.closePanel(
					'test-scope',
					'panel2'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel1', 'panel3' ]
				);
			} );
		} );

		describe( 'togglePanel', () => {
			it( 'closes panel if it is active', () => {
				const getMock = mockPreferencesSelectors.get;
				getMock.mockReturnValue( [ 'panel1', 'panel2' ] );
				const setMock = mockPreferencesDispatchers.set;
				mockSelectors.isPanelActive.mockReturnValue( true );

				const thunk = storeConfig.actions!.togglePanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel2' ]
				);
			} );

			it( 'opens panel if it is not active', () => {
				const getMock = mockPreferencesSelectors.get;
				getMock.mockReturnValue( [ 'panel2' ] );
				const setMock = mockPreferencesDispatchers.set;
				mockSelectors.isPanelActive.mockReturnValue( false );

				const thunk = storeConfig.actions!.togglePanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel2', 'panel1' ]
				);
			} );

			it( 'opens panel when activePanels is undefined', () => {
				const getMock = mockPreferencesSelectors.get;
				getMock.mockReturnValue( undefined );
				const setMock = mockPreferencesDispatchers.set;
				mockSelectors.isPanelActive.mockReturnValue( false );

				const thunk = storeConfig.actions!.togglePanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel1' ]
				);
			} );

			it( 'opens panel when activePanels is empty', () => {
				const getMock = mockPreferencesSelectors.get;
				getMock.mockReturnValue( [] );
				const setMock = mockPreferencesDispatchers.set;
				mockSelectors.isPanelActive.mockReturnValue( false );

				const thunk = storeConfig.actions!.togglePanel(
					'test-scope',
					'panel1'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( setMock ).toHaveBeenCalledWith(
					'test-scope',
					'activePanels',
					[ 'panel1' ]
				);
			} );
		} );
	} );
} );
