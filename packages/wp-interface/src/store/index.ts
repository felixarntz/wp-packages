import { createReduxStore, register } from '@wordpress/data';
import { combineStoreConfigs } from 'wp-store-utils';
import { STORE_NAME } from './name';
import { storeConfig as sidebarStoreConfig } from './sidebar';
import { storeConfig as modalStoreConfig } from './modal';
import { storeConfig as panelStoreConfig } from './panel';
import { storeConfig as preferencesStoreConfig } from './preferences';

const storeConfig = combineStoreConfigs(
	sidebarStoreConfig,
	modalStoreConfig,
	panelStoreConfig,
	preferencesStoreConfig
);

export const store = createReduxStore( STORE_NAME, storeConfig );
register( store );
