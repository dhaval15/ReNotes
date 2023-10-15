import {
	Input,
	Button,
} from '@chakra-ui/react';
import usePromiseDisclosure, { useGetter } from '../hooks/usePromiseDisclosure';
import DialogContainer from './DialogContainer';

export default function EditCollectionDialog({ dialogRef }) {
	const {
		isOpen,
		onClose,
		params,
	} = usePromiseDisclosure(dialogRef);

	const [collection, setCollection] = useGetter((from) => from?.old, params);

	return (
		<DialogContainer
			dialogRef={dialogRef}
			isOpen={isOpen}
			onClose={() => onClose(null)}
			title="Edit Collection"
			body={
				<Input
					placeholder="Enter collection name"
					value={collection ?? ''}
					onChange={(e) => setCollection(e.target.value)} />
			}
			footer={<>
				<Button onClick={() => onClose(collection)} colorScheme="blue" mr={4}>
					{params?.old == null ? 'Create' : 'Update'}
				</Button>
				<Button onClick={() => onClose(null)}>Cancel</Button>
			</>
			}
		/>
	)
}
