import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '../reducers/blogSlice';
import { useNotification } from '../context/NotificationContext';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [, notificationDispatch] = useNotification();

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title,
        author,
        url,
      };

      dispatch(createBlog(newBlog));

      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: {
          message: `${user.name} added a new blog titled "${title}" by ${author}`,
          type: 'success',
        },
      });

      setTitle('');
      setAuthor('');
      setUrl('');

      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    } catch (exception) {
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: { message: 'Error adding the blog', type: 'error' },
      });
      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
