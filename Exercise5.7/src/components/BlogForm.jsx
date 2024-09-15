import React, { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({ setBlogs, blogs, setNotification, setNotificationType }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const addBlog = (event) => {
    event.preventDefault();
    blogService.create(newBlog).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog));
      setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
      setNotificationType('success');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
    setNewBlog({ title: '', author: '', url: '' });
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleChange}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleChange}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
