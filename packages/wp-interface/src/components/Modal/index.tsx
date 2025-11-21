import {
	createSlotFill,
	__experimentalUseSlotFills as useSlotFills,
	Modal as CoreModal,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import type { WordPressComponentProps } from '@wordpress/components/build-types/context';
import { store as interfaceStore } from '../../store';
import type { ModalProps } from './types';

const { Fill, Slot } = createSlotFill( 'Modal' );

/**
 * Renders a modal for the application.
 *
 * Multiple modals can be rendered, but only one can be active at a time.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function InternalModal( props: WordPressComponentProps< ModalProps, 'div' > ) {
	const { identifier, title, children, ...additionalProps } = props;

	const isModalActive = useSelect(
		( select ) => select( interfaceStore ).isModalActive( identifier ),
		[ identifier ]
	);
	const { closeModal } = useDispatch( interfaceStore );

	if ( ! isModalActive ) {
		return null;
	}

	return (
		<Fill>
			<CoreModal
				title={ title }
				closeButtonLabel={ __( 'Close modal', 'ai-services' ) }
				onRequestClose={ closeModal }
				{ ...additionalProps }
			>
				{ children }
			</CoreModal>
		</Fill>
	);
}

export const Modal = Object.assign( InternalModal, {
	displayName: 'Modal',
	Slot: Object.assign( Slot, { displayName: 'Modal.Slot' } ),
} );

/**
 * Hook to check whether any fills are provided for the Modal slot.
 *
 * @returns True if there are any Modal fills, false otherwise.
 */
export function useHasModal() {
	const fills = useSlotFills( 'Modal' );
	return !! fills?.length;
}
