import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('');

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      setBlogs(initialBlogs);
    });

    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');

      // Başarılı giriş bildirimi
      setNotification(`Welcome back, ${user.name}`);
      setNotificationType('success');
      setTimeout(() => {
        setNotification(null);
      }, 5000);

    } catch (exception) {
      setNotification('wrong username or password');
      setNotificationType('error');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogAppUser');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const addBlog = (event) => {
    event.preventDefault();
    blogService.create(newBlog).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog));
      setNewBlog({ title: '', author: '', url: '' });

      // Başarılı blog ekleme bildirimi
      setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`);
      setNotificationType('success');
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
  };

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notification} type={notificationType} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} type={notificationType} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

      <h2>Create New Blog</h2>
      <form onSubmit={addBlog}>
        <div>
          Title: 
          <input 
            type="text" 
            name="title" 
            value={newBlog.title} 
            onChange={handleChange} 
          />
        </div>
        <div>
          Author: 
          <input 
            type="text" 
            name="author" 
            value={newBlog.author} 
            onChange={handleChange} 
          />
        </div>
        <div>
          URL: 
          <input 
            type="text" 
            name="url" 
            value={newBlog.url} 
            onChange={handleChange} 
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default App;
