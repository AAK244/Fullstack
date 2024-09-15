import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { likeBlog, deleteBlog } from '../reducers/blogSlice';
import { displayNotification } from '../reducers/notificationSlice';

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLike = () => {
    dispatch(likeBlog(blog));
    dispatch(
      displayNotification(
        `You liked "${blog.title}" by ${blog.author}`,
        'success',
        5
      )
    );
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id));
      dispatch(
        displayNotification(
          `${user.name} removed the blog titled "${blog.title}" by ${blog.author}`,
          'success',
          5
        )
      );
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={handleDelete}>Delete</button>
      </div>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        Likes: {blog.likes}
        <button onClick={handleLike}>Like</button>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
};

export default Blog;
