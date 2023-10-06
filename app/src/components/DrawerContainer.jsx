import React from 'react';
import {
	useMediaQuery,
	Box,
	Drawer,
	DrawerContent,
	DrawerOverlay,
	DrawerCloseButton,
	DrawerBody,
	Flex,
	Stack,
	IconButton,
	useDisclosure,
} from '@chakra-ui/react';
import Icon from '@oovui/react-feather-icons';
import '../App.css';

function SidebarX({ isOpen, side, left }) {
	const props = left ? { left: 0 } : { right: 0 }
	if (!isOpen)
		return (<> </>)
	return (
		<Box
			position="fixed"
			h="100vh"
			w={300}
			bg="gray.50"
			{...props}
		>
			{side}
		</Box>
	);
}


function DrawerX({ isOpen, onClose, side, left }) {

	return (
		<Drawer placement={left ? "left" : "right"} onClose={onClose} isOpen={isOpen}>
			<DrawerOverlay>
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerBody>
						{side}
					</DrawerBody>
				</DrawerContent>
			</DrawerOverlay>
		</Drawer>
	);
}

function MainView({ isOpen, onOpen, onClose, left, body, header }) {
	return (
		<Stack ml="0.5em" p={4} alignItems="center" width="100%"maxWidth="700px">
			<Flex width="100%" alignItems="center">
				{(left &&
					<IconButton
						icon={<Icon type={isOpen ? 'chevron-left' : 'align-justify'} />}
						onClick={() => isOpen ? onClose() : onOpen()}
						mr={4}
					/>)}
				{header}
				{(!left &&
					<IconButton
						icon={<Icon type={isOpen ? 'chevron-right' : 'align-justify'} />}
						onClick={() => isOpen ? onClose() : onOpen()}
						ml={4}
					/>)}
			</Flex>
			{body}
		</Stack>
	);
}

function DrawerContainer({ left = true, body, side, header }) {
	const [isWideScreen] = useMediaQuery('(min-width: 769px)');
	const {isOpen, onOpen, onClose} = useDisclosure();

	const mainStyle = {
		ml: left ? (isWideScreen && isOpen ? 300 : 0) : 0,
		mr: left ? 0 : (isWideScreen && isOpen ? 300 : 0),
		p: 0,
		overflowY: 'auto',
		alignItems: 'center',
	};

	return (
		<Box position="relative">
			{isWideScreen ? (
				<SidebarX left={left} isOpen={isOpen} side={side} />
			) : (
				<>
					<DrawerX left={left} onClose={onClose} isOpen={isOpen} side={side} />
				</>
			)}
			<Stack {...mainStyle}>
				<MainView
					isOpen={isOpen}
					onOpen={onOpen}
					onClose={onClose}
					body={body}
					left={left}
					header={header} />
			</Stack>
		</Box>
	);
}

export default DrawerContainer;
