import React, { useState, useEffect } from 'react';
import {
	useDisclosure,
	useMediaQuery,
  Box,
  Drawer,
  Input,
  InputGroup,
  InputRightElement,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  IconButton,
	Flex,
  Spacer,
  VStack,
  Text,
  StackDivider,
	Heading,
} from '@chakra-ui/react';
import Icon from '@oovui/react-feather-icons';
import NodeTile from '../components/NodeTile';
import ReNotesApi from '../api/ReNotesApi';
import '../App.css';

function CollectionList({ collections, selectCollection, selectedCollection }) {
  return (
    <VStack
      align="start"
			alignItems="stretch"
    >
      {collections.map(collection => (
        <Text
          key={collection}
					fontSize={20}
					fontWeight="semibold"
          onClick={() => selectCollection(collection)}
          cursor="pointer"
					backgroundColor={collection === selectedCollection ? 'gray.200' : 'transparent'}
					py={2}
					px={4}
        >
          {collection}
        </Text>
      ))}
    </VStack>
  );
}

function CollectionSidebar({ collections, selectCollection, selectedCollection, isOpen}) {
	if (!isOpen)
		return (<> </>)
  return (
    <Box position="fixed" h="100vh" w={300} bg="gray.50">
			<Heading as="h3" p={4}>Collections</Heading>
      <CollectionList
        collections={collections}
        selectCollection={selectCollection}
        selectedCollection={selectedCollection}
      />
    </Box>
  );
}

function CollectionsDrawer({
  isOpen,
  onOpen,
  onClose,
  collections,
  selectCollection,
  selectedCollection,
}) {
  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay>
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Collection</DrawerHeader>
					<DrawerBody>
						<CollectionList
							collections={collections}
							selectCollection={selectCollection}
							selectedCollection={selectedCollection}
						/>
					</DrawerBody>
				</DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}


function MainView({ collection, nodes, isOpen, onOpen, onClose }) {
	const [search, setSearch] = useState('');
	const [filteredNodes, setFilteredNodes] = useState(null);
	useEffect(() => {
		if (search == ''){
			setFilteredNodes(null);
		}
		else{
			const regexp = new RegExp(search, 'i')
			setFilteredNodes(nodes.filter((node) => regexp.test(node.title)));
		}
	}, [search]);
  return (
		<Flex ml="0.5em" direction="column" boxSizing="border-box" p={4} width="100%">
			<Flex height="3em">
				<IconButton
					icon={<Icon type={isOpen ? 'chevron-left': 'align-justify'}/>}
					onClick={() => isOpen ? onClose() : onOpen()}
					mr={4}
				/>
				<InputGroup minWidth="20em" maxWidth="30em">
					<Input 
						value={search}
						onChange={(event) => setSearch(event.target.value.trim())}
						variant='filled' placeholder='Search' onCh/>
					<InputRightElement width='4rem'>
        		<Icon type="search" onClick={() => {}}/>
      		</InputRightElement>
				</InputGroup>
				<Spacer/>
				<IconButton
					icon={<Icon type='plus'/>}
					onClick={() => isOpen ? onClose() : onOpen()}
				/>
			</Flex>
			<VStack
				mt="1em"
				align="start"
				flex={1}
				overflowY="auto"
				className="hide-scroll"
				spacing={4}
			>
				{(filteredNodes ?? nodes).map(node => (
					<NodeTile node={node}/> 
				))}
			</VStack>
		</Flex>
  );
}

function DashboardPage() {
	const [isWideScreen] = useMediaQuery('(min-width: 769px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [nodes, setNodes] = useState([]);
  const api = new ReNotesApi('http://192.168.2.76:3030'); // Replace with your API base URL

	useEffect(() => {
		if (isWideScreen){
			onOpen();
		} else {
			onClose();
		}
	}, [isWideScreen]);

  useEffect(() => {
    // Fetch collections when the component mounts
    api.getCollections()
      .then(data => {
				setCollections(data);
				if (selectedCollection == null) {
					setSelectedCollection(data[0]);
				}
			}).catch(error => console.error(error));
  }, []);

  useEffect(() => {
    // Fetch nodes for the selected collection
    if (selectedCollection) {
      api.getCollection(selectedCollection)
        .then(data => setNodes(data.nodes))
        .catch(error => console.error(error));
    }
  }, [selectedCollection]);

  const selectCollection = (collection) => {
    setSelectedCollection(collection);
		if (!isWideScreen)
    	onClose();
  };

  return (
		<Box position="relative">
      {isWideScreen ? (
        <CollectionSidebar
          collections={collections}
          selectCollection={selectCollection}
          selectedCollection={selectedCollection}
          onClose={() => onClose()}
					isOpen={isOpen}
        />
      ) : (
        <>
          <CollectionsDrawer
            isOpen={isOpen}
            onOpen={() => onOpen()}
            onClose={() => onClose()}
            collections={collections}
            selectCollection={selectCollection}
            selectedCollection={selectedCollection}
          />
        </>
      )}
      <Flex ml={isWideScreen && isOpen ? 300 : 0} p={0} overflowY="auto">
				<MainView 
					collection={selectedCollection} 
					nodes={nodes} 
					onOpen={() => onOpen()}
					onClose={() => onClose()}
					isOpen={isOpen}/>
      </Flex>
    </Box>
  );
}

export default DashboardPage;
