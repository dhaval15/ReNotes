import { 
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import ReNotesApi from '../api/ReNotesApi'; 

const api = new ReNotesApi('/api'); 

export const fetchCollectionsAsync = createAsyncThunk('collections/fetchCollections', async () => {
  const collections = await api.getCollections();
  const selected = await api.getCollection(collections[0]);
  return { collections, selected };
});

export const fetchCollectionAsync = createAsyncThunk('collections/fetchCollection', async (name) => {
  const response = await api.getCollection(name);
  return response;
});

export const createCollectionAsync = createAsyncThunk('collection/createCollection', async (name) => {
  await api.createCollection(name);
  return name;
});

export const deleteNoteAsync = createAsyncThunk('notes/deleteNote', async (payload) => {
  await api.deleteCollection(payload.name, payload.drop);
  return payload.name;
});

const collectionsSlice = createSlice({
  name: 'collections',
	initialState : {
		data: [],
		status: 'idle', 
		error: null,
		selected: null,
	},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionsAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchCollectionsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.collections;
        state.selected = action.payload.selected;
      })
      .addCase(fetchCollectionsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCollectionAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchCollectionAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selected = action.payload;
      })
      .addCase(fetchCollectionAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createCollectionAsync.fulfilled, (state, action) => {
        state.data = [...state.data, action.payload]; 
      })
      .addCase(deleteNoteAsync.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.data = state.data.filter((collection) => collection.id !== deletedId); 
      });
  },
});

export default collectionsSlice.reducer;
