import { 
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import ReNotesApi from '../api/ReNotesApi'; 

export const fetchNodeAsync = createAsyncThunk('editNode/fetchNote', async (payload, thunkApi) => {
	const api = new ReNotesApi(thunkApi.getState().auth.token);
  const response = await api.getNode(payload.collection, payload.id);
  return response;
});

export const saveContentAsync = createAsyncThunk('editNote/saveContent', async (_, thunkApi) => {
	const api = new ReNotesApi(thunkApi.getState().auth.token);
	const state = thunkApi.getState().editNote;
	if (state.content == null)
		throw 'Already upto date';
	const response = await api.updateNode(state.node.collection, state.node.id, state.content, {});
	return response;
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
		clearAlert: (state, action) => {
			state.message = null;
		},
		clear: (state, action) => {
			if (state.content == null) {
				state.node = null;
				state.content = null;
				localStorage.setItem('editorContent', null);
				state.message = null;
				state.alert = null;
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
      .addCase(saveContentAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(saveContentAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
				state.node = action.payload;
				state.content = null;
      })
      .addCase(saveContentAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.alert = action.error.message;
      })
	},
});

export const {
	setContent,
	clearAlert,
	saveContent,
	clear,
} = editNoteSlice.actions;

export default editNoteSlice.reducer;
