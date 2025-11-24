/**
 * External dependencies
 */
import type * as Ariakit from '@ariakit/react';

export type TabsContextProps =
	| {
			store: Ariakit.TabStore;
			instanceId: string;
	  }
	| undefined;

export type TabsProps = {
	children: Ariakit.TabProviderProps[ 'children' ];
	selectOnMove?: Ariakit.TabProviderProps[ 'selectOnMove' ];
	selectedTabId?: Ariakit.TabProviderProps[ 'selectedId' ];
	defaultTabId?: Ariakit.TabProviderProps[ 'defaultSelectedId' ];
	onSelect?: Ariakit.TabProviderProps[ 'setSelectedId' ];
	activeTabId?: Ariakit.TabProviderProps[ 'activeId' ];
	defaultActiveTabId?: Ariakit.TabProviderProps[ 'defaultActiveId' ];
	onActiveTabIdChange?: Ariakit.TabProviderProps[ 'setActiveId' ];
	orientation?: Ariakit.TabProviderProps[ 'orientation' ];
};

export type TabListProps = {
	children: Ariakit.TabListProps[ 'children' ];
};

// TODO: consider prop name changes (tabId, selectedTabId)
// compound technique

export type TabProps = {
	tabId: NonNullable< Ariakit.TabProps[ 'id' ] >;
	children?: Ariakit.TabProps[ 'children' ];
	disabled?: Ariakit.TabProps[ 'disabled' ];
	render?: Ariakit.TabProps[ 'render' ];
};

export type TabPanelProps = {
	children?: Ariakit.TabPanelProps[ 'children' ];
	tabId: NonNullable< Ariakit.TabPanelProps[ 'tabId' ] >;
	focusable?: Ariakit.TabPanelProps[ 'focusable' ];
};
