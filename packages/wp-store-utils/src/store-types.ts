/**
 * WordPress dependencies
 */
import type { WPDataRegistry } from '@wordpress/data/build-types/registry';
import type {
	ActionCreator,
	Resolver,
	Selector,
	StoreInstance,
	StoreDescriptor,
	CurriedSelectorsOf,
} from '@wordpress/data/build-types/types';
import type { ReduxStoreConfig } from '@wordpress/data/build-types/redux-store';

export type {
	WPDataRegistry,
	ActionCreator,
	Resolver,
	Selector,
	StoreInstance,
	StoreDescriptor,
	CurriedSelectorsOf,
	ReduxStoreConfig,
};

export interface Action< Type = string, Payload = Record< string, never > > {
	type: Type;
	payload: Payload;
}

export interface SelectorWithCustomCurrySignature {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	CurriedSignature: Function;
}

type CurriedState< State, F > = F extends SelectorWithCustomCurrySignature
	? F[ 'CurriedSignature' ]
	: F extends ( state: State, ...args: infer P ) => infer R
	? ( ...args: P ) => R
	: F;

export type ThunkArgs<
	State extends object,
	ActionCreators extends MapOf< ActionCreator >,
	CombinedAction,
	Selectors extends MapOf< Selector >,
> = {
	select: {
		[ key in keyof Selectors ]: CurriedState< State, Selectors[ key ] >;
	};
	dispatch: ActionCreators & ( ( action: CombinedAction ) => void );
	registry: WPDataRegistry;
};

export type Dispatcher< DispatcherArgs > = (
	t: DispatcherArgs
) => void | Promise< void >;

type MapOf< T > = { [ name: string ]: T };

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type Control = Function;

// This is compatible with the `ReduxStoreConfig` type from '@wordpress/data'.
export interface StoreConfig<
	State extends object,
	ActionCreators extends MapOf< ActionCreator >,
	CombinedAction,
	Selectors extends MapOf< Selector >,
> {
	initialState?: State;
	actions?: ActionCreators;
	controls?: MapOf< Control >;
	reducer: ( state: State, action: CombinedAction ) => State;
	resolvers?: MapOf< Resolver >;
	selectors?: Selectors;
}
