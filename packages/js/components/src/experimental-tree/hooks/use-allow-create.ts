/**
 * External dependencies
 */
import classNames from 'classnames';
import React, { useMemo, useRef } from 'react';

/**
 * Internal dependencies
 */
import { Item, AutocompleteProps } from '../types';

function mapItems( items: Item[] ): Record< string, boolean > {
	return items.reduce( ( map, { label, children } ) => {
		return {
			...map,
			[ label ]: true,
			...( children?.length ? mapItems( children ) : {} ),
		};
	}, {} as Record< string, boolean > );
}

export function useAllowCreate( {
	allowCreate,
	inputValue,
	items,
	onCreateClick,
}: UseAllowCreateInput ) {
	const creatingButtonRef = useRef< HTMLButtonElement >();
	const mappedItems = useMemo( () => mapItems( items ), [ items ] );
	const isInputValueInItems = inputValue ? inputValue in mappedItems : false;

	if ( ! allowCreate ) {
		return {};
	}

	function handleClick() {
		if ( typeof onCreateClick === 'function' ) {
			onCreateClick( isInputValueInItems ? undefined : inputValue );
		}
	}

	function handleInputKeyDown(
		event: React.KeyboardEvent< HTMLInputElement >
	) {
		if ( event.code === 'Enter' || event.code === 'Comma' ) {
			event.preventDefault();
			handleClick();
		}
	}

	return {
		allowCreateProps: {
			ref( element: HTMLButtonElement ) {
				creatingButtonRef.current = element;
			},
			children: isInputValueInItems ? undefined : inputValue,
			onClick: handleClick,
			className: items?.length
				? undefined
				: 'experimental-woocommerce-autocomplete__create-action--highlighted',
		},
		onInputKeyDown: handleInputKeyDown,
	};
}

export type UseAllowCreateInput = Pick<
	AutocompleteProps,
	'allowCreate' | 'onCreateClick' | 'items'
> & {
	inputValue: string;
};