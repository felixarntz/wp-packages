import {
	createSlotFill,
	__experimentalUseSlotFills as useSlotFills,
} from '@wordpress/components';
import type { WordPressComponentProps } from '@wordpress/components/build-types/context';
import type { FooterProps } from './types';

const { Fill, Slot } = createSlotFill( 'Footer' );

/**
 * Renders a wrapper for the footer of the application.
 *
 * Any children passed to this component will be rendered inside the footer.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function InternalFooter( props: WordPressComponentProps< FooterProps, null > ) {
	const { children } = props;
	return <Fill>{ children }</Fill>;
}

export const Footer = Object.assign( InternalFooter, {
	displayName: 'Footer',
	Slot: Object.assign( Slot, { displayName: 'Footer.Slot' } ),
} );

/**
 * Hook to check whether any fills are provided for the Footer slot.
 *
 * @returns True if there are any Footer fills, false otherwise.
 */
export function useHasFooter() {
	const fills = useSlotFills( 'Footer' );
	return !! fills?.length;
}
