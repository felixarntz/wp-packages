/**
 * External dependencies
 */
import clsx from 'clsx';
import type { WordPressComponentProps } from 'wp-component-utils';

/**
 * Internal dependencies
 */
import type { HelpTextProps } from './types';

/**
 * Renders a help text paragraph.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function HelpText(
	props: WordPressComponentProps< HelpTextProps, 'p' >
) {
	const { id, className, children, ...additionalProps } = props;

	return (
		<p
			id={ id }
			className={ clsx(
				'components-base-control__help',
				'components-base-control__help-text',
				className
			) }
			{ ...additionalProps }
		>
			{ children }
		</p>
	);
}
