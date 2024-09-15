import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState('');

  useEffect(() => {
    blogService.getAll().then(initialBlogs => {
      console.log('Loaded blogs:', initialBlogs);  // Verileri kontrol etmek için ekleyin
      const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
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
        username: userName,
        password,
      });

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUserName('');
      setPassword('');

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

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notification} type={notificationType} />
      {user ? (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="Create New Blog">
            <BlogForm 
              setBlogs={setBlogs} 
              blogs={blogs} 
              setNotification={setNotification} 
              setNotificationType={setNotificationType} 
              user={user} 
            />
          </Togglable>
          {blogs.length > 0 ? (
            blogs.map(blog => 
              <Blog key={blog.id || blog.title} blog={blog} blogs={blogs} setBlogs={setBlogs} user={user} />
            )
          ) : (
            <p>No blogs available</p>
          )}
        </div>
      ) : (
        <div>
          <h2>log in to application</h2>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                name="userName"
                value={userName}
                onChange={({ target }) => setUserName(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                name="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit">login</button>
          </form>
        </div>
      )}
    </div>
  );
};

App.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  userName: PropTypes.string,
  password: PropTypes.string,
  notification: PropTypes.string,
  notificationType: PropTypes.string,
  setBlogs: PropTypes.func,
  setNotification: PropTypes.func,
  setNotificationType: PropTypes.func,
};

export default App;
