import React from 'react';
import {
	Text,
	Wrap,
	VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NodeTile = ({ node }) => {
	return (
		<VStack
			key={node.id}
			gap="0.1em"
			align="start">
			<Link
				to={`/${node.collection}/${node.id}`}
				className="node-link"
				style={{
					fontSize: 24,
				}}>
				{node.title}
			</Link>
			<Wrap>
				{node.tags?.map(tag => (
					<Tag tag={tag} />
				))}
			</Wrap>
		</VStack>
	)
};

const Tag = ({ tag }) => {
	return (
		<Text key={tag} fontSize="14" fontWeight="600"> #{tag} </Text>
	)
}

export default NodeTile;
