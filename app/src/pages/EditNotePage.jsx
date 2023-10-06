import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '../components/Editor';

import { useDispatch, useSelector } from 'react-redux';
import {
	fetchNodeAsync,
	updateNoteAsync,
	saveContentAsync,
	clearAlert,
	setContent,
} from '../reducers/editNoteReducer';
import { ToastContainer } from '../components/ToastContainer';


const EditNotePage = () => {
	const dispatch = useDispatch();
	const { collection, id } = useParams();
	const node = useSelector((state) => state.editNote.node);

	useEffect(() => {
		dispatch(fetchNodeAsync({ collection, id }));
	}, [dispatch, id, collection]);

	const onChangeDebounced = (text) => {
		dispatch(setContent(text));
	};

	const onSave = () => {
		dispatch(saveContentAsync());
	};

	return (
		<>
			<ToastContainer
				onAlert={() => useSelector((state) => state.editNote.alert)}
				onClearMessage={() => dispatch(clearAlert())}
			/>
			{node?.content != null ?
				<Editor 
					initialContent={node.content} 
					onChangeDebounced={onChangeDebounced} 
					onSave={onSave}
				/>
				: <div> 'Loading' </div>
			}
		</>
	)
}

export default EditNotePage
