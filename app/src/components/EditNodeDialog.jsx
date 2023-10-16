import {
	Button,
	Input,
} from '@chakra-ui/react';
import TagsInput from './TagsInput';
import DialogContainer from './DialogContainer';
import usePromiseDisclosure, { useGetter } from '../hooks/usePromiseDisclosure';

const EditNodeDialog = ({ dialogRef }) => {
	const {
		isOpen,
		onClose,
		params,
	} = usePromiseDisclosure(dialogRef);

	const [title, setTitle] = useGetter((from) => from?.node?.title, params);
	const [tags, setTags] = useGetter((from) => from?.node?.tags ?? [], params);
	const allTags = params?.allTags;

	const handleCreateNode = () => {
		if (title) {
			onClose({
				title: title,
				tags: tags,
			});
		}
	};

	return (
		<DialogContainer
			isOpen={isOpen}
			onClose={() => onClose(null)}
			title={`${params?.node == null ? 'Create' : 'Update'} node`}
			dialogRef={dialogRef}
			body={
				<>
					<Input
						placeholder="Enter title"
						value={title}
						my={4}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<TagsInput
						value={tags}
						tags={allTags}
						onChange={(tags) => setTags(tags)}
					/>
				</>
			}
			footer={
				<>
					<Button onClick={handleCreateNode} colorScheme="blue" mr={4}>
						{params?.node == null ? 'Create' : 'Update'}
					</Button>
					<Button ml={4} onClick={() => onClose(null)}>Cancel</Button>
				</>
			}
		/>
	);
};

export default EditNodeDialog;
