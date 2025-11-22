import { createContext, useContext } from '@wordpress/element';
import type { InterfaceScopeProviderProps } from './types';

const InterfaceScopeContext = createContext< string | undefined >( undefined );
const { Provider } = InterfaceScopeContext;

/**
 * Provides the interface scope to child components.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function InterfaceScopeProvider( props: InterfaceScopeProviderProps ) {
	const { scope, children } = props;

	return <Provider value={ scope }>{ children }</Provider>;
}

/**
 * Hook to access the current interface scope.
 *
 * @returns The current interface scope.
 */
export function useInterfaceScope() {
	const context = useContext( InterfaceScopeContext );

	if ( context === undefined ) {
		throw new Error(
			'useInterfaceScope must be used within an InterfaceScopeProvider'
		);
	}

	return context;
}
