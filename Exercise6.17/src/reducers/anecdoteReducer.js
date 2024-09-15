import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

export const fetchAnecdotes = createAsyncThunk(
  'anecdotes/fetchAnecdotes',
  async () => {
    const response = await axios.get(baseUrl);
    return response.data;
  }
);

export const createAnecdote = createAsyncThunk(
  'anecdotes/createAnecdote',
  async (content) => {
    const newAnecdote = { content, votes: 0 };
    const response = await axios.post(baseUrl, newAnecdote);
    return response.data;
  }
);

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
    sortAnecdotes: (state) => {
      return state.slice().sort((a, b) => b.votes - a.votes);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnecdotes.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(createAnecdote.fulfilled, (state, action) => {
        state.push(action.payload);
      });
  },
});

export const { voteAnecdote, sortAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
