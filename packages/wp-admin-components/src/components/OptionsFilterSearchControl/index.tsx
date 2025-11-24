/**
 * External dependencies
 */
import clsx from 'clsx';
import type { WordPressComponentProps } from 'wp-component-utils';

/**
 * WordPress dependencies
 */
import { SearchControl } from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';
import { speak } from '@wordpress/a11y';

/**
 * Internal dependencies
 */
import type { OptionsFilterSearchControlProps } from './types';

/**
 * Renders a search control that filters options displayed elsewhere (e.g. in a checkbox list or radio list).
 *
 * @param props - Component props.
 * @returns The component to be rendered.
 */
export function OptionsFilterSearchControl(
	props: WordPressComponentProps< OptionsFilterSearchControlProps, null >
) {
	const {
		label: labelProp,
		options = [],
		onFilter,
		searchFields,
		messageResultFound,
		messageResultsFound,
		className,
		...additionalProps
	} = props;

	const [ filterValue, setFilterValue ] = useState( '' );
	const debouncedSpeak = useDebounce( speak, 500 );

	const setFilter = useCallback(
		( newFilterValue: string ) => {
			const fields = searchFields || [ 'label', 'value' ];
			const newFilteredOptions = options.filter( ( option ) => {
				if ( newFilterValue === '' ) {
					return true;
				}

				for ( const field of fields ) {
					if (
						option[ field ]
							?.toLowerCase()
							.includes( newFilterValue.toLowerCase() )
					) {
						return true;
					}
				}

				return false;
			} );

			setFilterValue( newFilterValue );
			onFilter( newFilteredOptions );

			const resultCount = newFilteredOptions.length;
			const resultsFoundMessageTemplate =
				resultCount === 1
					? messageResultFound || '%d result found.'
					: messageResultsFound || '%d results found.';
			let resultsFoundMessage: string;
			if ( resultsFoundMessageTemplate.includes( '%d' ) ) {
				resultsFoundMessage = resultsFoundMessageTemplate.replace(
					'%d',
					resultCount.toString()
				);
			} else {
				resultsFoundMessage = resultsFoundMessageTemplate;
			}

			debouncedSpeak( resultsFoundMessage, 'assertive' );
		},
		[ options, onFilter, searchFields, debouncedSpeak ]
	);

	return (
		<SearchControl
			label={ labelProp || 'Search options' }
			className={ clsx(
				'components-options-filter-search-control',
				className
			) }
			value={ filterValue }
			onChange={ setFilter }
			{ ...additionalProps }
		/>
	);
}
