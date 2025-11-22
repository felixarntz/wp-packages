import { ComplementaryArea } from '@wordpress/interface';
import { __experimentalUseSlotFills as useSlotFills } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import type { WordPressComponentProps } from '@wordpress/components/build-types/context';
import { store as keyboardShortcutsStore } from '@wordpress/keyboard-shortcuts';
import type { SidebarProps } from './types';

/**
 * Renders a sidebar for the application.
 *
 * Multiple sidebars can be rendered, but only one can be active at a time.
 * Additionally, sidebars can be pinned by the user for easy access. The PinnedSidebars component can be used to render
 * icon buttons for the pinned sidebars.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function InternalSidebar(
	props: WordPressComponentProps< SidebarProps, null >
) {
	const {
		identifier,
		title,
		icon,
		header,
		isPinnable,
		isActiveByDefault,
		children,
		closeButtonLabel,
	} = props;

	const shortcut = useSelect(
		( select ) =>
			select( keyboardShortcutsStore ).getShortcutRepresentation(
				'ai-services/toggle-sidebar',
				'display'
			),
		[]
	);

	return (
		<ComplementaryArea
			scope="ai-services"
			identifier={ identifier }
			title={ title }
			icon={ icon }
			header={ header }
			isPinnable={ isPinnable }
			isActiveByDefault={ isActiveByDefault }
			toggleShortcut={ shortcut ?? undefined }
			closeLabel={ closeButtonLabel ?? 'Close sidebar' }
		>
			{ children }
		</ComplementaryArea>
	);
}

const InternalSidebarSlot = () => {
	return <ComplementaryArea.Slot scope="ai-services" />;
};

export const Sidebar = Object.assign( InternalSidebar, {
	displayName: 'Sidebar',
	Slot: Object.assign( InternalSidebarSlot, { displayName: 'Sidebar.Slot' } ),
} );

/**
 * Hook to check whether any fills are provided for the Sidebar slot.
 *
 * @returns True if there are any Sidebar fills, false otherwise.
 */
export function useHasSidebar() {
	const fills = useSlotFills( 'ComplementaryArea/ai-services' );
	return !! fills?.length;
}
