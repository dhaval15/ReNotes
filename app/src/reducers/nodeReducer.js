
import {
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import ReNotesApi from '../api/ReNotesApi';

export const fetchNodeAsync = createAsyncThunk('node/fetchNote', async (payload, thunkApi) => {
	const api = new ReNotesApi(thunkApi.getState().auth.token);
	const response = await api.getNode(payload.collection, payload.id);
	return response;
});

export const updateNodeAsync = createAsyncThunk('collection/updateNode', async (payload, thunkApi) => {
	const api = new ReNotesApi(thunkApi.getState().auth.token);
	const state = thunkApi.getState().node;
	const node = state.node;
	const response = await api.updateNode(node.collection, node.id, null, payload);
	return response;
});

const nodeSlice = createSlice({
	name: 'node',
	initialState: {
		node: null,
		message: null,
	},
	reducers: {
		clearMessage: (state, _) => {
			state.message = null;
		},
		clear: (state, action) => {
			state.node = null;
			state.message = null;
			action.payload();
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
			.addCase(updateNodeAsync.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.node = {
					...state.node,
					...action.payload,
				};
			})
	},
});

export const {
	clear,
	clearMessage,
} = nodeSlice.actions;

export default nodeSlice.reducer;
