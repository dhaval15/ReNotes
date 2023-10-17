import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	ModalFooter,
} from '@chakra-ui/react';

export default function DialogContainer({
	isOpen,
	onClose,
	title,
	body,
	footer,
	dialogRef,
}) {
	return (
		<div ref={dialogRef}>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				scrollBehavior="inside"
				size="lg">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{title}</ModalHeader>
					<ModalBody>
						{body}
					</ModalBody>
					<ModalFooter>
						{footer}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	)
}
