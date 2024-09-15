import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { displayNotification } from './reducers/notificationSlice';
import { fetchBlogs } from './reducers/blogSlice';
import loginService from './services/login';
import blogService from './services/blogs';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser');
    setUser(null);
  };

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
