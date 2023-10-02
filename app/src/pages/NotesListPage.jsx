import React, { useState, useEffect } from 'react';
import { Container, Heading, Box, Text, Button } from '@chakra-ui/react';
import NoteTile from '../components/NoteTile';
import NotesApi from '../api/notesApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotesAsync,
  createNoteAsync,
  updateNoteAsync,
  deleteNoteAsync,
} from '../reducers/notesReducer';


const NotesListPage = () => {
	const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.data);
  const status = useSelector((state) => state.notes.status);
  const error = useSelector((state) => state.notes.error);
	
	useEffect(() => {
    dispatch(fetchNotesAsync());
  }, [dispatch]);

	return (
    <Container maxW="md" centerContent py={6}>
      <Heading size="xl" mb={4}>
        Notes List
      </Heading>
      {notes.map(note => (
				<NoteTile note={note}/>
      ))}
    </Container>
  );
};

export default NotesListPage;

