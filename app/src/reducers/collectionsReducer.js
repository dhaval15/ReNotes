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

export const createNodeAsync = createAsyncThunk('collection/createNode', async (payload, _thunkApi) => {
	const state = _thunkApi.getState().collections;
	const selected = state.selected;
  const response = await api.createNode(selected.name, payload.title, payload.tags, '', {});
  return response;
});

export const deleteCollectionAsync = createAsyncThunk('collection/deleteCollection', async (payload) => {
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
		loaded: false,
	},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionsAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchCollectionsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.collections;
        state.selected = action.payload.selected;
				state.loaded = true;
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
      .addCase(createNodeAsync.fulfilled, (state, action) => {
				state.selected = {
					...state.selected,
					nodes: [action.payload, ... state.selected.nodes],
				};
      })
      .addCase(deleteCollectionAsync.fulfilled, (state, action) => {
        const deleted = action.payload;
        state.data = state.data.filter((collection) => collection !== deleted); 
				if (state.selected.name === deleted) {
					state.selected = null;
				}
      });
  },
});

export default collectionsSlice.reducer;
