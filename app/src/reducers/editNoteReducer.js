import { 
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import ReNotesApi from '../api/ReNotesApi'; 

const api = new ReNotesApi('/api');

export const fetchNodeAsync = createAsyncThunk('editNode/fetchNote', async (payload) => {
  const response = await api.getNode(payload.collection, payload.id);
  return response;
});

export const updateNoteAsync = createAsyncThunk('editNote/updateNote', async (_, thunkApi) => {
	const state = thunkApi.getState().editNote;
	const note = state.note;
	const content = state.content;
	const sceneIndex = state.sceneIndex;
	if (note != null && sceneIndex != null && content != null) {
		const sceneId = note.scenes[sceneIndex].id;
		const response = await NoteApi.updateNote(note.id, sceneId, {content});
		return response;
	}
  throw 'Already up to date';
});

const editNoteSlice = createSlice({
  name: 'editNote',
  initialState: {
		node: null,
		content: null,
		message: null,
	},
	reducers: {
		setContent: (state, action) => {
			state.content = action.payload;
			localStorage.setItem('editorContent', state.content); 
		},
		clearMessage: (state, action) => {
			state.message = null;
		},
		clear: (state, action) => {
			if (state.content == null) {
				state.note = null;
				state.content = null;
				localStorage.setItem('editorContent', null);
				state.message = null;
				action.payload();
			}
			else {
				state.message = 'Unsaved content';
			}
		}
	},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodeAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchNodeAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.node = action.payload;
				state.sceneIndex = 0;
      })
      .addCase(fetchNodeAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.error.message;
      })
      .addCase(updateNoteAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateNoteAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
				state.content = null;
        state.note.scenes[state.sceneIndex] = action.payload;
        state.note = {
					... state.note,
					scenes: state.note.scenes,
				};
				//state.lastSave = new Date();
      })
      .addCase(updateNoteAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.error.message;
      })
	},
});

export const {
	setContent,
	clearMessage,
	clear,
} = editNoteSlice.actions;

export default editNoteSlice.reducer;
