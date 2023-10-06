import React, { useState, useEffect } from 'react';
import {
	Input,
	InputGroup,
	InputRightElement,
	Spacer,
	VStack,
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
			<Heading size="md" p={4}>
				Collections
			</Heading>
			{collections.map(collection => (
				<Text
					key={collection}
					fontSize={20}
					fontWeight="semibold"
					onClick={() => selectCollection(collection)}
					cursor="pointer"
					backgroundColor={collection === selected.name ? 'gray.200' : 'transparent'}
					py={2}
					px={4}
				>
					{collection}
				</Text>
			))}
			<CreateCollectionDialog />
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
					<Spacer mr={4}/>
					<CreateNodeDialog />
				</>
			}
			body={
				<VStack width="100%" align="start">
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
		/>
	)
}

export default DashboardPage;
