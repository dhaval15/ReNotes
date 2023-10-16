// NotePage.js
import React, { useEffect, useRef } from 'react';
import {
	VStack,
	HStack,
	Heading,
	Text,
	Flex,
	IconButton,
	Spacer,
	Button,
	Box,
	Link as ChakraLink,
	UnorderedList,
	ListItem,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import Icon from '@oovui/react-feather-icons';
import { useParams } from 'react-router-dom';
import {
	useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchNodeAsync, updateNodeAsync } from '../reducers/nodeReducer';
import './markdown.css';
import TinyIconButton from '../components/TinyIconButton';
import DrawerContainer from '../components/DrawerContainer';
import EditNodeDialog from '../components/EditNodeDialog';
import { deleteNodeAsync } from '../reducers/collectionsReducer';

function NodePage() {
	const { collection, id } = useParams();
	const dispatch = useDispatch();
	const node = useSelector((state) => state.node.node);

	const urlTransform = (key, url, node) => {
		if (key.startsWith('id:')) {
			const id = key.substring(3);
			return `#/${collection}/${id}`;
		}
		return key;
	}

	const navigate = useNavigate();

	useEffect(() => {
		dispatch(fetchNodeAsync({ collection, id }));
	}, [dispatch, id, collection]);


	if (node == null)
		return (
			<Text> Loading </Text>
		)

	return (
		<DrawerContainer
			header={
				<>
					<IconButton
						icon={<Icon type="arrow-left" />}
						onClick={() => {
							navigate(-1);
						}} />
					<Heading size="sm" ml="1em">
						{node.title}
					</Heading>
					<Spacer />
					<Button
						ml={4}
						onClick={async () => {
							navigate('edit');
						}}>
						Edit
					</Button>
				</>
			}
			body={
				<VStack width="100%" align="start" className="markdown">
					<ReactMarkdown urlTransform={urlTransform}>{node.content}</ReactMarkdown>
				</VStack>}
			side={<OverView pt={4} />}
			left={false}
		/>
	)
}

function OverView() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const dialogRef = useRef(null);
	const node = useSelector((state) => state.node.node);
	const allTags = useSelector((state) => state.collections.selected.tags);
	const outgoing = node.outgoing;
	const incoming = node.incoming;
	const collection = node.collection;

	const filteredIncoming = filterIncomingLinks(incoming);
	const filteredOutgoing = mapOutgoingLinks(outgoing);

	const deleteNode = () => {
		dispatch(deleteNodeAsync({
			nodeId: node.id,
			collection: collection,
		}));
		navigate(-1);
	};

	const editNode = async () => {
		const response = await dialogRef.current.openAsync({
			node: node,
			allTags: allTags,
		});
		dispatch(updateNodeAsync(response));
	};

	return (
		<VStack alignItems="start" p={4}>
			<HStack width="100%">
				<Spacer />
				<TinyIconButton type="trash-2" onClick={deleteNode} />
				<TinyIconButton type="edit-2" onClick={editNode} />
				<EditNodeDialog dialogRef={dialogRef} />
			</HStack>
			{filteredOutgoing.length !== 0 &&
				(<Box p="4">
					<Text fontSize="lg" fontWeight="bold" mb="4">
						Outgoing
					</Text>
					<Flex flexDirection="column">
						{filteredOutgoing.map((link, index) => (
							<Flex
								key={index}
								flexDirection="column">
								<ChakraLink
									href={`/#/${collection}/${link.target}`}
									rel="noopener noreferrer">
									{link.title}
								</ChakraLink>
								<UnorderedList ml={4}>
									{link.inline.map((i, _) => (<ListItem>{i}</ListItem>))}
								</UnorderedList>
							</Flex>
						))}
					</Flex>
				</Box>)}
			{filteredIncoming.length !== 0 &&
				(<Box p="4">
					<Text fontSize="lg" fontWeight="bold" mb="4">
						Incoming
					</Text>
					<Flex flexDirection="column">
						{filteredIncoming.map((link, index) => (
							<ChakraLink
								key={index}
								href={`/#/${collection}/${link.source}`}
								rel="noopener noreferrer">
								{link.title}
							</ChakraLink>
						))}
					</Flex>
				</Box>)}
		</VStack>
	)
}

function mapOutgoingLinks(links) {
	const mergedLinks = new Map();

	for (const link of links) {
		const { target, inline } = link;

		if (mergedLinks.has(target)) {
			const mergedLink = mergedLinks.get(target);
			if (!mergedLink.inline.includes(inline)) {
				mergedLink.inline.push(inline);
			}
		} else {
			mergedLinks.set(target, {
				...link,
				inline: [inline],
			});
		}
	}

	return Array.from(mergedLinks.values());
}

function filterIncomingLinks(links) {
	const uniqueLinks = new Set();
	return links.filter((link) => {
		const linkKey = `${link.source}`;
		if (!uniqueLinks.has(linkKey)) {
			uniqueLinks.add(linkKey);
			return true;
		}
		return false;
	});
}

export default NodePage;
