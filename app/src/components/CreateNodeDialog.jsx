import { useState } from 'react';
import {
	useDisclosure,
	Button,
	IconButton,
	Input,
	Textarea,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import Icon from '@oovui/react-feather-icons';
import { useDispatch } from 'react-redux';
import { createNodeAsync } from '../reducers/collectionsReducer';

const CreateNodeDialog = () => {
	const dispatch = useDispatch();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [title, setTitle] = useState('');
	const [tags, setTags] = useState('');

	const handleCreateNode = () => {
		const tagsArray = tags.split(' ').filter((tag) => tag !== ''); // Remove empty tags

		if (title && tagsArray.length > 0) {
			dispatch(createNodeAsync({
				title: title,
				tags: tagsArray,
			}));
			onClose(); // Close the dialog
		}
	};

	return (
		<>
			<IconButton
				icon={<Icon type='plus' />}
				onClick={onOpen}
			/>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Create a Node</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Input
							placeholder="Enter title"
							value={title}
							mt={4}
							onChange={(e) => setTitle(e.target.value)}
						/>
						<Input
							mt={4}
							placeholder="Enter space-separated tags"
							value={tags}
							onChange={(e) => setTags(e.target.value)}
						/>
					</ModalBody>

					<ModalFooter>
						<Button onClick={handleCreateNode} colorScheme="blue">
							Create
						</Button>
						<Button ml={4} onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreateNodeDialog;
