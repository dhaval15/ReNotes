// NotePage.js
import React, { useEffect } from 'react';
import { VStack, Heading, Text} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNodeAsync } from '../reducers/nodeReducer';
import './markdown.css';

function NodePage() {
  const { collection, id } = useParams();
  const dispatch = useDispatch();
  const node = useSelector((state) => state.node.node);

  useEffect(() => {
    dispatch(fetchNodeAsync({collection, id}));
  }, [dispatch, id, collection]);

	if (node == null)
		return (
			<Text> Loading </Text>
		)

  return (
		<VStack align="start">
			<Heading as="h4" p={2}> {node.title} </Heading>
			<div className="markdown"> 
					<ReactMarkdown>{node.content}</ReactMarkdown> 
			</div>
		</VStack>
	)
}

export default NodePage;
