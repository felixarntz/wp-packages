import { PinnedItems } from '@wordpress/interface';
import { useInterfaceScope } from '../InterfaceScopeProvider';

/**
 * Renders the container for any pinned sidebars.
 *
 * Multiple sidebars can be rendered in the application, and users can pin them for easy access.
 * This component will automatically render icon buttons for all pinned sidebars.
 *
 * @returns The component to be rendered.
 */
export function PinnedSidebars() {
	const scope = useInterfaceScope();
	return <PinnedItems.Slot scope={ scope } />;
}
