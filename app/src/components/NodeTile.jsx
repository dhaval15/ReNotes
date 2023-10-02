import React from 'react';
import { 
	Text,
	Link,
	Wrap,
	VStack,
} from '@chakra-ui/react';

const NodeTile = ({ node }) => {
	return (
		<VStack
			key={node.id}
			align="start">
			<Link 
				href={`/${node.collection}/${node.id}`}
				style={{
					color: '#483248',
					fontSize: 24,
					fontWeight: 500,
				}}>
				{node.title}
			</Link>
			<Wrap>
				{node.tags?.map(tag => (
					<Tag tag={tag}/> 
				))}
			</Wrap>
		</VStack>
	)
};

const Tag = ({ tag }) => {
	return (
		<Text key={tag} fontSize="14"> #{tag} </Text>
	)
}

export default NodeTile;
