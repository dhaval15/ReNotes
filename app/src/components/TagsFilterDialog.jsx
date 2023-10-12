import { useState } from 'react';
import {
	Box,
	Tag,
	Button,
	IconButton,
	Wrap,
	WrapItem,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	useDisclosure,
} from '@chakra-ui/react';

import Icon from '@oovui/react-feather-icons';

function TagsFilterDialog({ tags, onTagsSelected }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedTags, setSelectedTags] = useState([]);

	const handleTagClick = (tag) => {
		const _selectedTags = selectedTags.includes(tag) ? selectedTags.filter((selectedTag) => selectedTag !== tag) : [tag, ...selectedTags]
		setSelectedTags(_selectedTags);
	};

	const clearTags = () => {
		setSelectedTags([]);
	};

	const onCloseDialog = () => {
		onClose();
		onTagsSelected(selectedTags);
	}

	return (
		<>
			<IconButton
				ml={4}
				onClick={() => {
					if (isOpen) {
						onCloseDialog();
					}
					else {
						onOpen();
					}
				}}>
				<Icon type="filter" />
			</IconButton>
			<Modal isOpen={isOpen} onClose={onCloseDialog}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Filter by Tags</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box>
							<Wrap spacing={2}>
								{tags.map((tag) => (
									<WrapItem key={tag}>
										<Tag
											onClick={() => handleTagClick(tag)}
											variant={selectedTags.includes(tag) ? 'solid' : 'outline'}
											colorScheme="teal"
											cursor="pointer"
										>
											{tag}
										</Tag>
									</WrapItem>

								))}
								<Button onClick={clearTags} variant="ghost" size="sm">
									Clear
								</Button>
							</Wrap>
						</Box>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}

export default TagsFilterDialog;

