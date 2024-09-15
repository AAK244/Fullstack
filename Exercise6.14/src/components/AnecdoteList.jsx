import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnecdotes, voteAnecdote, sortAnecdotes } from '../reducers/anecdoteReducer';
import { setNotificationWithTimeout } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => state.anecdotes);

  useEffect(() => {
    dispatch(fetchAnecdotes());
  }, [dispatch]);

  const vote = (id, content) => {
    dispatch(voteAnecdote(id));
    dispatch(setNotificationWithTimeout(`You voted: '${content}'`, 5000));
    dispatch(sortAnecdotes());
  };

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnecdoteList;
