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
import { useInitStore } from '../reducers/hooks';


export default function EditNotePage({collection, id}) {
	useInitStore();
	const dispatch = useDispatch();
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
				alertSelector={(state) => state.editNote.alert}
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

export function EditNotePageRoute() {
	const params = useParams();
	return <EditNotePage {...params}/>
}
