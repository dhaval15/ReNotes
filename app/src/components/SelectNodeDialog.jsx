import {
	Text,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import usePromiseDisclosure from '../hooks/usePromiseDisclosure';
import QuickDialog from './QuickDialog';

export default function SelectNodeDialog({ dialogRef }) {
	const {
		isOpen,
		onClose,
		params,
	} = usePromiseDisclosure(dialogRef);

	const selected = useSelector((state) => state.collections.selected);

	const filter = (node, query) => {
		return node.title.toLowerCase().includes(query.toLowerCase())
	};

	const renderNode = (node, _, isSelected) => {
		return (<Text padding={2}
			key={node.id}
			width="100%"
			textAlign="left"
			bg={isSelected ? "gray.100" : "transparent"}
		>
			{node.title}
		</Text>)
	};
	return (
		<QuickDialog
			isOpen={isOpen}
			onClose={onClose}
			query={params?.query}
			dialogRef={dialogRef}
			items={selected?.nodes ?? []}
			placeholder="Search for a node"
			renderItem={renderNode}
			filter={filter}
			onSelected={(node) => {
				onClose(node);
			}} />
	);
};
