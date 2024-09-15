import { useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from './reducers/blogSlice';
import { NotificationProvider } from './context/NotificationContext';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  return (
    <NotificationProvider>
      <div>
        <h2>Blogs</h2>
        <Notification />
        {user ? (
          <div>
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
          </div>
        )}
      </div>
    </NotificationProvider>
  );
};

export default App;
