import { combineReducers } from 'redux';

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  };
};

export const voteAnecdote = (id) => {
  return {
    type: 'VOTE',
    data: { id }
  };
};

export const addAnecdote = (content) => {
  return {
    type: 'ADD_ANECDOTE',
    data: { content }
  };
};

const anecdoteReducer = (state = [], action) => {
  switch (action.type) {
    case 'VOTE': {
      const id = action.data.id;
      const anecdoteToVote = state.find(a => a.id === id);
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      };
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
      );
    }
    case 'ADD_ANECDOTE': {
      const newAnecdote = asObject(action.data.content);
      return [...state, newAnecdote];
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  anecdotes: anecdoteReducer
});

export default rootReducer;
