import {
	Text,
} from '@chakra-ui/react';
import usePromiseDisclosure, { useGetter } from '../hooks/usePromiseDisclosure';
import QuickDialog from './QuickDialog';

export default function SelectItemDialog({ dialogRef }) {
	const {
		isOpen,
		onClose,
		params,
	} = usePromiseDisclosure(dialogRef);

	const filter = (item, query) => {
		return params.title(item).toLowerCase().includes(query.toLowerCase())
	};

	const renderItem = (item, _, isSelected) => {
		return (<Text padding={2}
			key={params?.id(item)}
			width="100%"
			textAlign="left"
			bg={isSelected ? "gray.100" : "transparent"}
		>
			{params?.title(item)}
		</Text>)
	};

	return (
		<QuickDialog
			isOpen={isOpen}
			onClose={onClose}
			initialQuery={params?.query}
			dialogRef={dialogRef}
			items={params?.items ?? []}
			placeholder="Search"
			renderItem={renderItem}
			filter={filter}
			onSelected={(item) => {
				onClose(item);
			}} />
	);
};
