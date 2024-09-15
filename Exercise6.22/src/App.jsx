import { useQuery, useQueryClient } from '@tanstack/react-query';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import axios from 'axios';

const fetchAnecdotes = async () => {
  const { data } = await axios.get('http://localhost:3001/anecdotes');
  return data;
};

const updateAnecdote = async (anecdote) => {
  const { data } = await axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`, anecdote);
  return data;
};

const App = () => {
  const queryClient = useQueryClient();
  
  const { data: anecdotes, error, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: fetchAnecdotes,
    retry: 1,
  });

  const handleVote = async (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    try {
      await updateAnecdote(updatedAnecdote);
      queryClient.invalidateQueries('anecdotes');
    } catch (error) {
      console.error('Failed to update anecdote votes:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
