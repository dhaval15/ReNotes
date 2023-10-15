import { useState, useEffect } from 'react';
import {
	Input,
	VStack,
	Text,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import usePromiseDisclosure, { useGetter } from '../hooks/usePromiseDisclosure';
import DialogContainer from './DialogContainer';

export default function SelectNodeDialog({ dialogRef }) {
	const {
		isOpen,
		onClose,
		params,
	} = usePromiseDisclosure(dialogRef);

	const [query, setQuery] = useGetter((from) => from?.query, params);

	const [filteredNodes, setFilteredNodes] = useState([]);
	const nodes = useSelector((state) => state.collections.selected.nodes);


	useEffect(() => {
		if (query == null || query == '') {
			setFilteredNodes(nodes);
		}
		else {
			const filtered = nodes.filter((node) =>
				node.title.toLowerCase().includes(query.toLowerCase())
			);
			setFilteredNodes(filtered);
		}
	}, [query, nodes]);

	return (
		<div ref={dialogRef}>
			<DialogContainer
				isOpen={isOpen}
				onClose={() => {
					onClose(null);
				}}
				title="Select a Node"
				body={
					<>
						<Input
							placeholder="Search for a node"
							value={query ?? ''}
							onChange={(e) => setQuery(e.target.value)}
						/>
						<VStack align="start" spacing={2} mt={4}>
							{filteredNodes.length === 0 ? (
								<Text>No nodes found.</Text>
							) : (
								filteredNodes.map((node) => (
									<Text
										key={node.id}
										onClick={() => {
											onClose(node);
										}}
										width="100%"
										textAlign="left"
									>
										{node.title}
									</Text>
								))
							)}
						</VStack>
					</>
				} />
		</div>
	);
};
