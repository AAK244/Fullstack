import React, { useState } from 'react';
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

export default Blog;
