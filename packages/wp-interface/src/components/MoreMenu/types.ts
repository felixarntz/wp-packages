import type { ReactNode } from 'react';
import type { DropdownMenuProps } from '@wordpress/components/build-types/dropdown-menu/types';

export type LinkMenuItemProps = {
	href: string;
	children: ReactNode;
};

export type MoreMenuProps = {
	menuLabel?: string;
	externalLinkA11yHint?: string;
	children: DropdownMenuProps[ 'children' ];
};
