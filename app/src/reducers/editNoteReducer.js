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
