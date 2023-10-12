import { configureStore, getDefaultMiddleware, applyMiddleware } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import collectionsReducer from './reducers/collectionsReducer';
import nodeReducer from './reducers/nodeReducer';
import editNoteReducer from './reducers/editNoteReducer';
import { logger } from './logger';

const loggerMiddleware = store => next => action => {
	logger.debug('dispatching', action);
  let result = next(action)
  logger.debug('next state', store.getState())
  return result
}

const store = configureStore({
  reducer: {
		auth: authReducer,
    collections: collectionsReducer,
    editNote: editNoteReducer,
    node: nodeReducer,
  },
  middleware: [
		... getDefaultMiddleware(), 
		loggerMiddleware,
	],
});

export default store;
