import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '../components/Editor';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNodeAsync,
  updateNoteAsync,
	setContent,
} from '../reducers/editNoteReducer';


const EditNotePage = () => {
	const dispatch = useDispatch();
  const { collection, id } = useParams();
  const node = useSelector((state) => state.editNote.node);

  useEffect(() => {
    dispatch(fetchNodeAsync({collection, id}));
  }, [dispatch, id, collection]);

	const onSave = (text) => {
    dispatch(setContent(text));
	};

	return (
    <>
			{ node?.content != null ? 
				<Editor initialContent={node.content} onSave={onSave}/>
				: <div> 'Loading' </div>
			}
    </>
	)
}

export default EditNotePage
