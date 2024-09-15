import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../NotificationContext';

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const { dispatch } = useNotification();

  const onCreate = async (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';

    if (content.length >= 5) {
      try {
        const newAnecdote = { content, votes: 0 };
        await axios.post('http://localhost:3001/anecdotes', newAnecdote);
        queryClient.invalidateQueries('anecdotes');
        dispatch({ type: 'SHOW', payload: `You created '${content}'` });
        setTimeout(() => {
          dispatch({ type: 'HIDE' });
        }, 5000);
      } catch (error) {
        console.error('Failed to add anecdote:', error);
      }
    } else {
      console.log('Anecdote content must be at least 5 characters long.');
    }
  };

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
