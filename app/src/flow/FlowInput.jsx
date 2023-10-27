import { Input } from "@chakra-ui/react";

export default function FlowInput(props) {
	return (
		<Input
			style={{
				overflowY: 'hidden',
				borderRadius: 0,
			}}
			px={4}
			py={2}
			bg='gray.50'
			variant='unstyled'
			autoFocus
			{...props}
		/>
	)
}
