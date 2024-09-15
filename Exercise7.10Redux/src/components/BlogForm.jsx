import { useState } from 'react';
import PropTypes from 'prop-types';
import blogService from '../services/blogs';
import { useDispatch } from 'react-redux';
import { displayNotification } from '../reducers/notificationSlice';

const BlogForm = ({ setBlogs, blogs, user }) => {
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
        user,
      };

      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));

      dispatch(
        displayNotification(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
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

BlogForm.propTypes = {
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default BlogForm;
