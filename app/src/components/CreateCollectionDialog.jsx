import React, { useState } from 'react';
import {
	useDisclosure,
	Box,
	Input,
	Button,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay
} from '@chakra-ui/react';
import Icon from '@oovui/react-feather-icons';
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
		<Box>
			<IconButton
				icon={<Icon type='plus' />}
				onClick={onOpen}
			/>
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
		</Box>
	);
}
