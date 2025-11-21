import { describe, it, expect } from 'vitest';

import { STORE_NAME } from './name';

describe( 'STORE_NAME', () => {
	it( 'should have the correct value', () => {
		expect( STORE_NAME ).toBe( 'ai-services/interface' );
	} );
} );
