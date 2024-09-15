import React, { useState } from 'react';
import blogService from '../services/blogs';

const BlogForm = ({ setBlogs, blogs, setNotification, setNotificationType, user }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title,
        author,
        url,
        user: user,
      };

      const returnedBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(returnedBlog));

      setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
      setNotificationType('success');
      setTimeout(() => {
        setNotification(null);
      }, 5000);

      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (exception) {
      setNotification('Error adding the blog');
      setNotificationType('error');
      setTimeout(() => {
        setNotification(null);
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
