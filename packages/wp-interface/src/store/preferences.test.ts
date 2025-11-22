import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { store as preferencesStore } from '@wordpress/preferences';
import type { createRegistry, createRegistrySelector } from '@wordpress/data';
import {
	storeConfig,
	type ActionCreators,
	type Selectors,
	type CombinedAction,
} from './preferences';

type WPDataRegistry = ReturnType< typeof createRegistry >;
type RegistrySelector = ReturnType< typeof createRegistrySelector >;

vi.mock( '@wordpress/data', async ( importOriginal ) => {
	const actual = await importOriginal< typeof import('@wordpress/data') >();
	return {
		...actual,
		createRegistrySelector: vi.fn( ( factory ) => factory ),
	};
} );

describe( 'preferences store', () => {
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
			getPreference: vi.fn(),
		};

		mockDispatchers = Object.assign( vi.fn(), {
			setPreference: vi.fn(),
			togglePreference: vi.fn(),
		} );
	} );

	describe( 'selectors', () => {
		describe( 'getPreference', () => {
			it( 'calls the preferences store get selector with the correct arguments', () => {
				const mockSelect = vi.fn( () => mockPreferencesSelectors );
				const selector = (
					storeConfig.selectors!
						.getPreference as unknown as RegistrySelector
				 )( mockSelect );

				mockPreferencesSelectors.get.mockReturnValue( 'some-value' );

				const result = selector( {}, 'test-scope', 'some-preference' );

				expect( mockSelect ).toHaveBeenCalledWith( preferencesStore );
				expect( mockPreferencesSelectors.get ).toHaveBeenCalledWith(
					'test-scope',
					'some-preference'
				);
				expect( result ).toBe( 'some-value' );
			} );
		} );
	} );

	describe( 'actions', () => {
		describe( 'setPreference', () => {
			it( 'dispatches to the preferences store set action', () => {
				const thunk = storeConfig.actions!.setPreference(
					'test-scope',
					'some-preference',
					'some-value'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockRegistry.dispatch ).toHaveBeenCalledWith(
					preferencesStore
				);
				expect( mockPreferencesDispatchers.set ).toHaveBeenCalledWith(
					'test-scope',
					'some-preference',
					'some-value'
				);
			} );
		} );

		describe( 'togglePreference', () => {
			it( 'toggles the preference value from true to false', () => {
				mockSelectors.getPreference.mockReturnValue( true );

				const thunk = storeConfig.actions!.togglePreference(
					'test-scope',
					'some-preference'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.getPreference ).toHaveBeenCalledWith(
					'test-scope',
					'some-preference'
				);
				expect( mockRegistry.dispatch ).toHaveBeenCalledWith(
					preferencesStore
				);
				expect( mockPreferencesDispatchers.set ).toHaveBeenCalledWith(
					'test-scope',
					'some-preference',
					false
				);
			} );

			it( 'toggles the preference value from false to true', () => {
				mockSelectors.getPreference.mockReturnValue( false );

				const thunk = storeConfig.actions!.togglePreference(
					'test-scope',
					'some-preference'
				);
				thunk( {
					registry: mockRegistry,
					select: mockSelectors,
					dispatch: mockDispatchers,
				} );

				expect( mockSelectors.getPreference ).toHaveBeenCalledWith(
					'test-scope',
					'some-preference'
				);
				expect( mockRegistry.dispatch ).toHaveBeenCalledWith(
					preferencesStore
				);
				expect( mockPreferencesDispatchers.set ).toHaveBeenCalledWith(
					'test-scope',
					'some-preference',
					true
				);
			} );
		} );
	} );
} );
