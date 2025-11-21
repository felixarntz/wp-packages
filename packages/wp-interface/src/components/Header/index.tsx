import {
	createSlotFill,
	__experimentalUseSlotFills as useSlotFills,
} from '@wordpress/components';
import type { WordPressComponentProps } from '@wordpress/components/build-types/context';
import type { HeaderProps } from './types';

const { Fill, Slot } = createSlotFill( 'Header' );

/**
 * Renders a wrapper for the header of the application.
 *
 * Any children passed to this component will be rendered inside the header.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function InternalHeader( props: WordPressComponentProps< HeaderProps, null > ) {
	const { children } = props;
	return <Fill>{ children }</Fill>;
}

export const Header = Object.assign( InternalHeader, {
	displayName: 'Header',
	Slot: Object.assign( Slot, { displayName: 'Header.Slot' } ),
} );

/**
 * Hook to check whether any fills are provided for the Header slot.
 *
 * @returns True if there are any Header fills, false otherwise.
 */
export function useHasHeader() {
	const fills = useSlotFills( 'Header' );
	return !! fills?.length;
}
