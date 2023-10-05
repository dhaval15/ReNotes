import { useState, useEffect, useContext, createContext } from 'react';
import {
	useDisclosure,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	VStack,
	Text,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

export default function SelectNodeDialog({dialogRef}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [resolver, setResolver] = useState(null);

	const openAsync = async () => {
		onOpen();
		let resolveFn;
		const promise = new Promise((resolve, reject) => {
			resolveFn = resolve;
		});
		setResolver(() => resolveFn);
		return promise;
	}

	const [searchText, setSearchText] = useState('');
	const [filteredNodes, setFilteredNodes] = useState([]);
	const nodes = useSelector((state) => state.collections.selected.nodes);

	useEffect(() => {
		// Filter nodes based on the search text
		const filtered = nodes.filter((node) =>
			node.title.toLowerCase().includes(searchText.toLowerCase())
		);
		setFilteredNodes(filtered);
	}, [searchText, nodes]);

	useEffect(() => {
		if(dialogRef.current){
			dialogRef.current.openAsync = openAsync;
		}
	}, [openAsync, dialogRef.current]);

	return (
		<div ref={dialogRef}>
			<Modal
				isOpen={isOpen}
				onClose={() => {
					resolver(null);
					onClose();
				}}
				size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Select a Node</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Input
							placeholder="Search for a node"
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
						/>
						<VStack align="start" spacing={2} mt={4}>
							{filteredNodes.length === 0 ? (
								<Text>No nodes found.</Text>
							) : (
								filteredNodes.map((node) => (
									<Text
										key={node.id}
										onClick={() => {
											resolver(node);
											onClose();
										}}
										width="100%"
										textAlign="left"
									>
										{node.title}
									</Text>
								))
							)}
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
};
