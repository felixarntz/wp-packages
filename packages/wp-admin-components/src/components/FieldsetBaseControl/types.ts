/**
 * External dependencies
 */
import type { WordPressComponent } from 'wp-component-utils';

/**
 * WordPress dependencies
 */
import type { BaseControl } from '@wordpress/components';

type BaseControlProps = typeof BaseControl extends WordPressComponent<
	null,
	infer P,
	true
>
	? P
	: never;

export type FieldsetBaseControlProps = BaseControlProps;
