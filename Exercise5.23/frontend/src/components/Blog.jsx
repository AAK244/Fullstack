import { useState } from 'react';
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

  console.log('Rendered Blog:', blog);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const blogId = blog.id.toString(); // blog.id'yi açıkça stringe dönüştürün

    const updatedBlog = {
      ...blog,
      id: blogId,
      likes: likes + 1,
    };

    try {
      const returnedBlog = await blogService.update(blogId, updatedBlog);
      setLikes(returnedBlog.likes);

      const sortedBlogs = blogs
        .map(b => (b.id === blogId ? returnedBlog : b))
        .sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleRemove = async () => {
    const blogId = blog.id.toString(); // blog.id'yi açıkça stringe dönüştürün

    const confirmRemove = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);
    if (confirmRemove) {
      try {
        await blogService.remove(blogId);
        setBlogs(blogs.filter(b => b.id !== blogId));
      } catch (error) {
        console.error('Error removing blog:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
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
    id: PropTypes.string.isRequired, // ID'nin zorunlu olduğunu belirtiyoruz
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
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
