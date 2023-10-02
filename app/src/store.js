import { configureStore, getDefaultMiddleware, applyMiddleware } from '@reduxjs/toolkit';
import collectionsReducer from './reducers/collectionsReducer';
import nodeReducer from './reducers/nodeReducer';
import editNoteReducer from './reducers/editNoteReducer';

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const store = configureStore({
  reducer: {
    collections: collectionsReducer,
    editNote: editNoteReducer,
    node: nodeReducer,
  },
  middleware: [
		... getDefaultMiddleware(), 
		logger,
	],
});

export default store;
