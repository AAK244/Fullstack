import { configureStore } from '@reduxjs/toolkit';
import anecdoteReducer from './reducers/anecdoteReducer';
import filterReducer from './reducers/filterReducer';

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
    filter: filterReducer
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    anecdotes: store.getState().anecdotes,
    filter: store.getState().filter
  });
});

export default store;
