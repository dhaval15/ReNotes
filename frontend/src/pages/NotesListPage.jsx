import React, { useState, useEffect } from 'react';
import { Container, Heading, Box, Text, Button } from '@chakra-ui/react';
import NotesApi from '../api/notesApi';

const api = new NotesApi('http://192.168.2.22:3030/api');

const NotesListPage = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      const notesData = await api.getNotes();
      setNotes(notesData);
    }
    fetchNotes();
  }, []);
	return (
    <Container maxW="md" centerContent py={6}>
      <Heading size="xl" mb={4}>
        Notes List
      </Heading>
      {notes.map(note => (
        <Box
          key={note.id}
          w="100%"
          p={4}
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          mb={4}
        >
          <Heading size="lg" mb={2}>
            {note.title}
          </Heading>
          <Text>{note.content}</Text>
          <Button
            colorScheme="red"
            mt={2}
            onClick={() => api.deleteNote(note.id)}
          >
            Delete
          </Button>
        </Box>
      ))}
    </Container>
  );
};

export default NotesListPage;

