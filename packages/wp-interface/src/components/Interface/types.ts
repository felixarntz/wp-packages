import type { ReactNode } from 'react';
import type { InterfaceSkeletonProps } from '@wordpress/interface';

export type InterfaceProps = {
	className?: string;
	labels: InterfaceSkeletonProps[ 'labels' ];
	children: ReactNode;
};
