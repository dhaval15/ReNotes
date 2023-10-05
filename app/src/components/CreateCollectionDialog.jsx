import React, { useState } from 'react';
import {
	useDisclosure,
	Input,
	Flex,
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { createCollectionAsync } from '../reducers/collectionsReducer';

export default function CreateCollectionDialog() {
	const dispatch = useDispatch();
	const [name, setName] = useState('');
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleCreateCollection = () => {
		if (name.length > 4) {
			dispatch(createCollectionAsync(name));
			onClose();
		}
	};

	return (
		<Flex alignItems="center">
			<Button onClick={onOpen}>Create</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create a Collection</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Input
							placeholder="Enter collection name"
							value={name}
							onChange={(e) => setName(e.target.value)} />
					</ModalBody>

					<ModalFooter>
						<Button onClick={handleCreateCollection} colorScheme="blue">
							Create
						</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Flex>
	);
}
