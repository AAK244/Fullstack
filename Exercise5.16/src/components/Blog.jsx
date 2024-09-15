import  { useState } from 'react';
import PropTypes from 'prop-types';
import blogService from '../services/blogs';

const Blog = ({ blog, setBlogs, blogs, user }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: likes + 1,
    };

    const returnedBlog = await blogService.update(blog.id, updatedBlog);
    setLikes(returnedBlog.likes);

    const sortedBlogs = blogs
      .map(b => (b.id === blog.id ? returnedBlog : b))
      .sort((a, b) => b.likes - a.likes);
    setBlogs(sortedBlogs);
  };

  const handleRemove = async () => {
    const confirmRemove = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);
    if (confirmRemove) {
      await blogService.remove(blog.id);
      setBlogs(blogs.filter(b => b.id !== blog.id));
    }
  };

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-header">
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className="blog-details">
          <p><a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
          <p>likes {likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.user ? blog.user.name : 'Anonymous'}</p>
          {user && blog.user && user.username === blog.user.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
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
    user: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  setBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

export default Blog;
