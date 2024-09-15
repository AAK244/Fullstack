import { configureStore } from '@reduxjs/toolkit';
import anecdoteReducer from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';
import notificationReducer from './reducers/notificationReducer';

const loadState = () => {
  const serializedState = localStorage.getItem('state');
  if (serializedState === null) {
    return undefined;
  }
  return JSON.parse(serializedState);
};

const saveState = (state) => {
  const serializedState = JSON.stringify(state);
  localStorage.setItem('state', serializedState);
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    anecdotes: store.getState().anecdotes,
    filter: store.getState().filter,
    notification: store.getState().notification,
  });
});

export default store;
