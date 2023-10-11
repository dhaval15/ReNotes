import { 
	createSlice,
	createAsyncThunk,
} from '@reduxjs/toolkit';
import ReNotesApi from '../api/ReNotesApi'; 

export const loginAsync = createAsyncThunk('auth/login', async (payload) => {
  const response = await ReNotesApi.login(payload.username, payload.password);
  return response;
});

const authSlice = createSlice({
  name: 'node',
  initialState: {
		node: null,
		token: null,
		message: null,
	},
	reducers: {
		setAuth: (state, action) => {
			state.token = action.payload.token;
			state.expiry = action.payload.expiry;
		},
		logout: (state, _) => {
			state.token = null;
			state.expiry = null;
			localStorage.removeItem('token');
			localStorage.removeItem('expiry');
		},
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
      .addCase(loginAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
				localStorage.setItem('token', action.payload.token);
				localStorage.setItem('expiry', action.payload.expiry);
        state.token = action.payload.token;
				state.expiry = action.payload.expiry;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.message = action.error.message;
      })
	},
});

export const {
	clear,
	clearMessage,
	setAuth,
	saveAuth,
	logout,
} = authSlice.actions;

export default authSlice.reducer;
