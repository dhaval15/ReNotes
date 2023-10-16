import React, { useState, useEffect, useRef } from 'react';
import {
	Input,
	InputGroup,
	InputRightElement,
	Spacer,
	VStack,
	HStack,
	Heading,
	Button,
	IconButton,
} from '@chakra-ui/react';
import '../App.css';
import Icon from '@oovui/react-feather-icons';
import NodeTile from '../components/NodeTile';
import { useSelector, useDispatch } from 'react-redux';
import {
	createCollectionAsync,
	createNodeAsync,
	fetchCollectionAsync,
	fetchCollectionsAsync,
	renameCollectionAsync,
} from '../reducers/collectionsReducer';
import { logout } from '../reducers/authReducer';
import EditNodeDialog from '../components/EditNodeDialog';
import DrawerContainer from '../components/DrawerContainer';
import CollectionTile from '../components/CollectionTile';
import TagsFilterDialog from '../components/TagsFilterDialog';
import EditCollectionDialog from '../components/EditCollectionDialog';
import TinyIconButton from '../components/TinyIconButton';

function CollectionList() {
	const dialogRef = useRef(null);
	const dispatch = useDispatch();
	const collections = useSelector((state) => state.collections.data);
	const selected = useSelector((state) => state.collections.selected);

	const selectCollection = (collection) => {
		dispatch(fetchCollectionAsync(collection));
	};
	return (
		<>
			<EditCollectionDialog dialogRef={dialogRef} />
			<VStack
				align="start"
				alignItems="stretch"
				height="100%"
			>
				<HStack>
					<Heading size="md" py={4} pl={4} pr={2}>
						Collections
					</Heading>
					<TinyIconButton
						type='plus'
						onClick={async () => {
							const response = await dialogRef.current.openAsync({});
							if (response)
								dispatch(createCollectionAsync(response));
						}}
					/>
				</HStack>
				{collections.map(collection => (
					<CollectionTile
						onRename={async () => {
							const response = await dialogRef.current.openAsync({ old: collection });
							if (response)
								dispatch(renameCollectionAsync({
									name: response,
									old: collection,
								}));
						}}
						collection={collection}
						onClick={() => selectCollection(collection)}
						isSelected={selected && collection === selected.name}
					/>
				))}
				<Spacer />
				<Button onClick={() => dispatch(logout())} variant="ghost" borderRadius={0}>
					Logout
				</Button>
			</VStack>
		</>
	);
}

function DashboardPage() {
	const dialogRef = useRef(null);
	const dispatch = useDispatch();
	const [search, setSearch] = useState('');
	const selected = useSelector((state) => state.collections.selected);
	const [filteredNodes, setFilteredNodes] = useState(null);
	const loaded = useSelector((state) => state.collections.loaded);
	const [isTagsFilterVisible, setTagsFilterVisible] = useState(false);
	const [selectedTags, setSelectedTags] = useState([]);

	const onTagsSelected = (tags) => {
		setSelectedTags(tags);
	};

	useEffect(() => {
		const query = search.trim();
		if (selected == null)
			return;
		var filteredNodes = selected.nodes;
		if (query != '') {
			const regexp = new RegExp(query, 'i')
			filteredNodes = filteredNodes.filter((node) => regexp.test(node.title));
		}
		if (selectedTags.length > 0) {
			filteredNodes = filteredNodes.filter((node) => {
				return node.tags.some((tag) => selectedTags.includes(tag));
			});
		}
		setFilteredNodes(filteredNodes);
	}, [search, selectedTags]);
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
							onChange={(event) => setSearch(event.target.value)}
							variant='filled' placeholder='Search' />
						<InputRightElement width='4rem'>
							<TagsFilterDialog
								tags={selected?.tags ?? []}
								onTagsSelected={onTagsSelected} />
						</InputRightElement>
					</InputGroup>
					<Spacer mr={4} />
					<IconButton
						icon={<Icon type='plus' />}
						onClick={async () => {
							const response = await dialogRef.current.openAsync({ allTags: selected?.tags ?? [] });
							dispatch(createNodeAsync(response));
						}}
					/>
					<EditNodeDialog dialogRef={dialogRef} />
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
							<NodeTile key={node.id} node={node} />
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
