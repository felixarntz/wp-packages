/**
 * External dependencies
 */
import type { WordPressComponentProps } from 'wp-component-utils';

/**
 * WordPress dependencies
 */
import { Button, Dashicon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import type { InputVisibleButtonProps } from './types';

/**
 * Renders a wrapper for the actions within the header of the application.
 *
 * Any children passed to this component will be rendered inside the header actions area.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function InputVisibleButton(
	props: WordPressComponentProps< InputVisibleButtonProps, null >
) {
	const { visible, setVisible, showLabel, hideLabel, showText, hideText } =
		props;

	return (
		<Button
			variant="secondary"
			className="wp-admin-components-input-visible-button"
			onClick={ () => setVisible( ! visible ) }
			aria-label={ visible ? hideLabel : showLabel }
			__next40pxDefaultSize
		>
			<Dashicon
				icon={ visible ? 'hidden' : 'visibility' }
				aria-hidden="true"
			/>
			<span className="text">
				{ visible ? hideText || hideLabel : showText || showLabel }
			</span>
		</Button>
	);
}
