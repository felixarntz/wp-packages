/**
 * External dependencies
 */
import type { WordPressComponentProps } from 'wp-component-utils';

/**
 * WordPress dependencies
 */
import { BaseControl, VisuallyHidden } from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { FieldsetBaseControlProps } from './types';

/**
 * Renders a fieldset-based control.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function FieldsetBaseControl(
	props: WordPressComponentProps< FieldsetBaseControlProps, null >
) {
	const { label, hideLabelFromVision, children, ...additionalProps } = props;

	return (
		<BaseControl { ...additionalProps }>
			<fieldset className="components-base-control__fieldset">
				{ label &&
					( hideLabelFromVision ? (
						<VisuallyHidden as="legend">{ label }</VisuallyHidden>
					) : (
						<legend className="components-base-control__legend">
							{ label }
						</legend>
					) ) }
				{ children }
			</fieldset>
		</BaseControl>
	);
}
