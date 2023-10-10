// NotePage.js
import React, { useEffect } from 'react';
import {
	VStack,
	Heading,
	Text,
	Flex,
	IconButton,
	Spacer,
	Button,
	Box,
	Link as ChakraLink,
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import Icon from '@oovui/react-feather-icons';
import { useParams } from 'react-router-dom';
import {
	useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchNodeAsync } from '../reducers/nodeReducer';
import './markdown.css';
import DrawerContainer from '../components/DrawerContainer';

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
						onClick={() => {
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
	const outgoing = useSelector((state) => state.node.node.outgoing);
	const incoming = useSelector((state) => state.node.node.incoming);
	const collection = useSelector((state) => state.node.node.collection);

	const filteredIncoming = filterIncomingLinks(incoming);
	const filteredOutgoing = filterOutgoingLinks(outgoing);

	return (
		<VStack>
			<Box p="4">
				<Text fontSize="lg" fontWeight="bold" mb="4">
					Outgoing
				</Text>
				<Flex flexDirection="column">
					{filteredOutgoing.map((link, index) => (
						<ChakraLink
							key={index}
							href={`/#/${collection}/${link.target}`}
							rel="noopener noreferrer">
							{link.inline} ({link.title})
						</ChakraLink>
					))}
				</Flex>
			</Box>
			<Box p="4">
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
			</Box>
		</VStack>
	)
}

function filterOutgoingLinks(links) {
	const uniqueLinks = new Set();
	return links.filter((link) => {
		const linkKey = `${link.target}_${link.inline}`;
		if (!uniqueLinks.has(linkKey)) {
			uniqueLinks.add(linkKey);
			return true;
		}
		return false;
	});
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
