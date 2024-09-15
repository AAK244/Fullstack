import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { displayNotification } from '../reducers/notificationSlice';
import { createBlog } from '../reducers/blogSlice';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title,
        author,
        url,
      };

      dispatch(createBlog(newBlog));
      dispatch(
        displayNotification(
          `a new blog ${title} by ${author} added`,
          'success',
          5
        )
      );

      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (exception) {
      dispatch(displayNotification('Error adding the blog', 'error', 5));
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
