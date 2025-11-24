/**
 * External dependencies
 */
import type {
	HTMLInputTypeAttribute,
	ComponentType,
	Dispatch,
	SetStateAction,
} from 'react';

export type InputVisibleButtonProps = {
	visible: boolean;
	setVisible: Dispatch< SetStateAction< boolean > >;
	showLabel: string;
	hideLabel: string;
	showText?: string;
	hideText?: string;
};

export type SensitiveTextControlProps = {
	label: string;
	value: string | number;
	onChange: ( value: string ) => void;
	buttonShowLabel: string;
	buttonHideLabel: string;
	buttonShowText?: string;
	buttonHideText?: string;
	type?: HTMLInputTypeAttribute;
	id?: string;
	className?: string;
	help?: string;
	HelpContent?: ComponentType;
	hideLabelFromVision?: boolean;
	__nextHasNoMarginBottom?: boolean;
	__next40pxDefaultSize?: boolean;
};
