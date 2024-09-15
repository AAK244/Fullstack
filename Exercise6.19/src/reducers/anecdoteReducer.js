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

export const voteAnecdote = createAsyncThunk(
  'anecdotes/voteAnecdote',
  async (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
    const response = await axios.put(`${baseUrl}/${anecdote.id}`, updatedAnecdote);
    return response.data;
  }
);

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    sortAnecdotes: (state) => {
      return state.slice().sort((a, b) => b.votes - a.votes);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnecdotes.fulfilled, (state, action) => {
        return action.payload.slice().sort((a, b) => b.votes - a.votes);
      })
      .addCase(createAnecdote.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(voteAnecdote.fulfilled, (state, action) => {
        const updatedAnecdote = action.payload;
        return state.map(anecdote =>
          anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
        );
      });
  },
});

export const { sortAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
