import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { displayNotification } from './reducers/notificationSlice';
import { fetchBlogs } from './reducers/blogSlice';
import { login, logout, initializeUser } from './reducers/userSlice';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const notification = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(initializeUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(login({ username, password }))
      .then(() => {
        dispatch(displayNotification(`Welcome back, ${username}`, 'success', 5));
        setUsername('');
        setPassword('');
      })
      .catch(() => {
        dispatch(displayNotification('wrong username or password', 'error', 5));
      });
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
            <BlogForm />
          </Togglable>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
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

export default App;
