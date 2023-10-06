import React, { useState, useEffect, useMemo } from 'react';
import {
	useMediaQuery,
	Box,
	Drawer,
	Input,
	InputGroup,
	InputRightElement,
	DrawerContent,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	Heading,
	IconButton,
	Flex,
	Spacer,
	VStack,
	Text,
} from '@chakra-ui/react';
import '../App.css';
import Icon from '@oovui/react-feather-icons';
import NodeTile from '../components/NodeTile';
import { useSelector, useDispatch } from 'react-redux';
import {
	fetchCollectionAsync,
	fetchCollectionsAsync,
	openDrawer,
	setWideScreen,
} from '../reducers/collectionsReducer';
import CreateCollectionDialog from '../components/CreateCollectionDialog';
import CreateNodeDialog from '../components/CreateNodeDialog';

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

function CollectionSidebar({ isOpen }) {
	if (!isOpen)
		return (<> </>)
	return (
		<Box position="fixed" h="100vh" w={300} bg="gray.50">
			<Heading as="h3" p={4}>Collections</Heading>
			<CollectionList />
		</Box>
	);
}

;


function CollectionsDrawer({ isOpen }) {
	const dispatch = useDispatch();

	return (
		<Drawer placement="left" onClose={() => dispatch(openDrawer(false))} isOpen={isOpen}>
			<DrawerOverlay>
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Collection</DrawerHeader>
					<DrawerBody>
						<CollectionList />
					</DrawerBody>
				</DrawerContent>
			</DrawerOverlay>
		</Drawer>
	);
}


function MainView({ isOpen }) {
	const dispatch = useDispatch();
	const [search, setSearch] = useState('');
	const selected = useSelector((state) => state.collections.selected);
	const [filteredNodes, setFilteredNodes] = useState(null);
	useEffect(() => {
		if (search == '') {
			setFilteredNodes(null);
		}
		else {
			const regexp = new RegExp(search, 'i')
			setFilteredNodes(selected.nodes.filter((node) => regexp.test(node.title)));
		}
	}, [search]);
	return (
		<Flex ml="0.5em" direction="column" boxSizing="border-box" p={4} width="100%">
			<Flex height="3em">
				<IconButton
					icon={<Icon type={isOpen ? 'chevron-left' : 'align-justify'} />}
					onClick={() => dispatch(openDrawer(!isOpen))}
					mr={4}
				/>
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
			</Flex>
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
		</Flex>
	);
}

function DashboardPage() {
	const [isW] = useMediaQuery('(min-width: 769px)');
	const loaded = useSelector((state) => state.collections.loaded);
	const isOpen = useSelector((state) => state.collections.isDrawerOpen);
	const isWideScreen = useSelector((state) => state.collections.isWideScreen);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setWideScreen(isW));
	}, [isW]);

	useEffect(() => {
		if (!loaded)
			dispatch(fetchCollectionsAsync());
	}, [loaded]);

	return (
		<Box position="relative">
			{isWideScreen ? (
				<CollectionSidebar isOpen={isOpen}
				/>
			) : (
				<CollectionsDrawer isOpen={isOpen}
				/>
			)}
			<Flex ml={isWideScreen && isOpen ? 300 : 0} p={0} overflowY="auto">
				<MainView isOpen={isOpen} />
			</Flex>
		</Box>
	);
}

export default DashboardPage;
