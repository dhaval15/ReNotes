import React, { useState, useEffect } from 'react';
import {
	Input,
	InputGroup,
	InputRightElement,
	Spacer,
	VStack,
	HStack,
	Text,
	Heading,
} from '@chakra-ui/react';
import '../App.css';
import Icon from '@oovui/react-feather-icons';
import NodeTile from '../components/NodeTile';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchCollectionAsync,
	fetchCollectionsAsync,
} from '../reducers/collectionsReducer';
import CreateCollectionDialog from '../components/CreateCollectionDialog';
import CreateNodeDialog from '../components/CreateNodeDialog';
import DrawerContainer from '../components/DrawerContainer';
import CollectionTile from '../components/CollectionTile';

function CollectionList() {
	const dispatch = useDispatch();
	const collections = useSelector((state) => state.collections.data);
	const selected = useSelector((state) => state.collections.selected);

	const selectCollection = (collection) => {
		dispatch(fetchCollectionAsync(collection));
	};
	return (
		<VStack
			align="start"
			alignItems="stretch"
		>
			<HStack>
				<Heading size="md" py={4} pl={4} pr={2}>
					Collections
				</Heading>
				<CreateCollectionDialog/>
			</HStack>
			{collections.map(collection => (
				<CollectionTile
					collection={collection}
					onClick={() => selectCollection(collection)}
					isSelected={selected && collection === selected.name}
				/>
			))}
		</VStack>
	);
}

function DashboardPage() {
	const dispatch = useDispatch();
	const [search, setSearch] = useState('');
	const selected = useSelector((state) => state.collections.selected);
	const [filteredNodes, setFilteredNodes] = useState(null);
	const loaded = useSelector((state) => state.collections.loaded);
	useEffect(() => {
		if (search == '') {
			setFilteredNodes(null);
		}
		else {
			const regexp = new RegExp(search, 'i')
			setFilteredNodes(selected.nodes.filter((node) => regexp.test(node.title)));
		}
	}, [search]);
	useEffect(() => {
		if (!loaded)
			dispatch(fetchCollectionsAsync());
	}, [loaded]);
	return (
		<DrawerContainer
			header={
				<>
					<InputGroup maxWidth="30em">
						<Input
							value={search}
							onChange={(event) => setSearch(event.target.value.trim())}
							variant='filled' placeholder='Search' onCh />
						<InputRightElement width='4rem'>
							<Icon type="search" onClick={() => { }} />
						</InputRightElement>
					</InputGroup>
					<Spacer mr={4} />
					<CreateNodeDialog />
				</>
			}
			body={
				<VStack flex={1} overflowY="auto" width="100%" align="start">
					<VStack
						mt="1em"
						align="start"
						flex={1}
						overflowY="auto"
						className="hide-scroll"
						spacing={4}
					>
						{(filteredNodes ?? selected?.nodes ?? []).map(node => (
							<NodeTile node={node} />
						))}
					</VStack>
				</VStack>}
			side={<CollectionList pt={4} />}
			left={true}
			sticky={true}
		/>
	)
}

export default DashboardPage;
