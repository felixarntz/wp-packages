import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { store as interfaceStore } from '@wordpress/interface';
import type { createRegistry, createRegistrySelector } from '@wordpress/data';
import {
	storeConfig,
	type ActionCreators,
	type Selectors,
	type CombinedAction,
} from './modal';

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

describe( 'modal store', () => {
	let mockRegistry: WPDataRegistry;
	let mockSelectors: { [ K in keyof Selectors ]: Mock };
	let mockDispatchers: { [ K in keyof ActionCreators ]: Mock } & ( (
		action: CombinedAction
	) => void );
	let mockInterfaceSelectors: { isModalActive: Mock };
	let mockInterfaceDispatchers: { openModal: Mock; closeModal: Mock };

	beforeEach( () => {
		mockInterfaceSelectors = {
			isModalActive: vi.fn(),
		};
		mockInterfaceDispatchers = {
			openModal: vi.fn(),
			closeModal: vi.fn(),
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
			isModalActive: vi.fn(),
		};

		mockDispatchers = Object.assign( vi.fn(), {
			openModal: vi.fn( ( modalId ) => {
				const thunk = storeConfig.actions!.openModal( modalId );
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );
			} ),
			closeModal: vi.fn( () => {
				const thunk = storeConfig.actions!.closeModal();
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );
			} ),
			toggleModal: vi.fn( ( modalId ) => {
				const thunk = storeConfig.actions!.toggleModal( modalId );
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );
			} ),
		} );
	} );

	describe( 'selectors', () => {
		describe( 'isModalActive', () => {
			it( 'calls interface store selector with prefixed ID', () => {
				const isModalActiveMock = vi.fn( () => true );
				const mockSelect = vi.fn( () => ( {
					isModalActive: isModalActiveMock,
				} ) );
				const selector = (
					storeConfig.selectors!
						.isModalActive as unknown as RegistrySelector
				 )( mockSelect );

				const result = selector( {}, 'my-modal' );

				expect( mockSelect ).toHaveBeenCalledWith( interfaceStore );
				expect( isModalActiveMock ).toHaveBeenCalledWith(
					'ai-services/my-modal'
				);
				expect( result ).toBe( true );
			} );
		} );
	} );

	describe( 'actions', () => {
		describe( 'openModal', () => {
			it( 'dispatches openModal to interface store with prefixed ID', () => {
				storeConfig.actions!.openModal( 'my-modal' )( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockRegistry.dispatch ).toHaveBeenCalledWith(
					interfaceStore
				);
				expect(
					mockInterfaceDispatchers.openModal
				).toHaveBeenCalledWith( 'ai-services/my-modal' );
			} );
		} );

		describe( 'closeModal', () => {
			it( 'dispatches closeModal to interface store', () => {
				storeConfig.actions!.closeModal()( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockRegistry.dispatch ).toHaveBeenCalledWith(
					interfaceStore
				);
				expect(
					mockInterfaceDispatchers.closeModal
				).toHaveBeenCalled();
			} );
		} );

		describe( 'toggleModal', () => {
			it( 'closes modal if active', () => {
				mockSelectors.isModalActive.mockReturnValue( true );

				storeConfig.actions!.toggleModal( 'my-modal' )( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.isModalActive ).toHaveBeenCalledWith(
					'my-modal'
				);
				expect( mockDispatchers.closeModal ).toHaveBeenCalled();
				expect( mockDispatchers.openModal ).not.toHaveBeenCalled();
			} );

			it( 'opens modal if not active', () => {
				mockSelectors.isModalActive.mockReturnValue( false );

				storeConfig.actions!.toggleModal( 'my-modal' )( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.isModalActive ).toHaveBeenCalledWith(
					'my-modal'
				);
				expect( mockDispatchers.openModal ).toHaveBeenCalledWith(
					'my-modal'
				);
				expect( mockDispatchers.closeModal ).not.toHaveBeenCalled();
			} );
		} );
	} );
} );
