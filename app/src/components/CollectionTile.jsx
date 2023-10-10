import React from 'react';
import {
	HStack,
	Text,
	Spacer,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
} from '@chakra-ui/react';

import Icon from '@oovui/react-feather-icons';
import { useDispatch } from 'react-redux';
import { deleteCollectionAsync } from '../reducers/collectionsReducer';

function CollectionTile({ collection, isSelected, onClick }) {
	const dispatch = useDispatch();
	const deleteCollection = (event) => {
		event.stopPropagation();
		dispatch(deleteCollectionAsync({
			name: collection,
		}));
	};
	const renameCollection = (event) => {
		event.stopPropagation();
	};
	return (
		<HStack
			cursor="pointer"
			backgroundColor={isSelected ? 'gray.200' : 'transparent'}
			onClick={onClick}
			py={2}>
			<Text
				px={4}
				key={collection}
				fontSize={20}
				fontWeight="semibold"
			>
				{collection}
			</Text>
			<Spacer />
			<Menu>
				<MenuButton
					as={IconButton}
					variant="ghost"
					onClick={(event) => { event.stopPropagation(); }}
					icon={<Icon type="more-vertical" />}
				/>
				<MenuList>
					<MenuItem onClick={deleteCollection}>Delete</MenuItem>
					<MenuItem onClick={renameCollection}>Rename</MenuItem>
				</MenuList>
			</Menu>
		</HStack>
	)
}

export default CollectionTile;
