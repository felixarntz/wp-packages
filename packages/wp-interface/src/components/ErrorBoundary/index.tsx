import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useCopyToClipboard } from '@wordpress/compose';
import { doAction } from '@wordpress/hooks';
import type { CopyButtonProps, ErrorBoundaryProps } from './types';

/**
 * Renders a button that copies the provided text to the clipboard when clicked.
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
function CopyButton( props: CopyButtonProps ) {
	const { text, children } = props;
	const ref = useCopyToClipboard( text, () => {} );
	return (
		<Button size="compact" variant="secondary" ref={ ref }>
			{ children }
		</Button>
	);
}

/**
 * React error boundary component that catches JavaScript errors in its child component tree.
 */
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	{ error: Error | null }
> {
	/**
	 * Constructor.
	 *
	 * @param props - Component props.
	 */
	constructor( props: ErrorBoundaryProps ) {
		super( props );
		this.state = {
			error: null,
		};
	}

	/**
	 * Lifecycle method invoked after an error has been thrown by a descendant component.
	 *
	 * @param error - The error that was thrown.
	 */
	override componentDidCatch( error: Error ) {
		this.setState( { error } );

		doAction( 'editor.ErrorBoundary.errorLogged', error );
	}

	/**
	 * Renders the component.
	 *
	 * @returns The component to be rendered.
	 */
	override render() {
		const { error } = this.state;
		if ( ! error ) {
			return this.props.children;
		}

		return (
			<div className="wp-interface-error-boundary">
				<p>The page has encountered an unexpected error.</p>
				<div>
					{ error.stack && (
						<CopyButton text={ error.stack }>Copy error</CopyButton>
					) }
				</div>
			</div>
		);
	}
}
