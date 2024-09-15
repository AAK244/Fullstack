import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import { useDispatch, useSelector } from 'react-redux';
import { displayNotification } from './reducers/notificationSlice';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
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
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');

      dispatch(displayNotification(`Welcome back, ${user.name}`, 'success', 5));
    } catch (exception) {
      dispatch(displayNotification('wrong username or password', 'error', 5));
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedBlogAppUser');
  };

  return (
    <div>
      <h2>Blogs</h2>
      {notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
      {user ? (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="Create New Blog">
            <BlogForm setBlogs={setBlogs} blogs={blogs} user={user} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              blogs={blogs}
              setBlogs={setBlogs}
              user={user}
            />
          ))}
        </div>
      ) : (
        <div>
          <h2>log in to application</h2>
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
      )}
    </div>
  );
};

App.propTypes = {
  blogs: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  username: PropTypes.string,
  password: PropTypes.string,
  notification: PropTypes.string,
  notificationType: PropTypes.string,
  setBlogs: PropTypes.func,
  setNotification: PropTypes.func,
  setNotificationType: PropTypes.func,
};

export default App;
