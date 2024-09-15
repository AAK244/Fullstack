import { createSlice } from '@reduxjs/toolkit';

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  };
};

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote: (state, action) => {
      const id = action.payload;
      const anecdoteToVote = state.find(a => a.id === id);
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1;
      }
    },
    addAnecdote: (state, action) => {
      const newAnecdote = asObject(action.payload);
      state.push(newAnecdote);
    },
    sortAnecdotes: (state) => {
      return state.slice().sort((a, b) => b.votes - a.votes);
    },
  },
});

export const { voteAnecdote, addAnecdote, sortAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
