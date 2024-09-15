import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { setUser, logoutUser } from "./reducers/userReducer";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Users from "./components/Users";
import UserBlogs from "./components/UserBlogs";
import BlogDetails from "./components/BlogDetails";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);

  const [blogFormVisible, setBlogFormVisible] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs());
    }
  }, [dispatch, user]);

  const addBlog = (blogObject) => {
    const blogWithUser = { ...blogObject, userId: user.id };
    dispatch(createBlog(blogWithUser));
    setBlogFormVisible(false);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    dispatch(logoutUser());
    blogService.setToken(null);
  };

  if (!user) {
    return (
      <div>
        {notification && <div className="notification">{notification}</div>}
        <LoginForm />
      </div>
    );
  }

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Blogs</Link> | <Link to="/users">Users</Link>
        </nav>

        <h2>blogs</h2>
        {notification && <div className="notification">{notification}</div>}
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>

        {blogFormVisible ? (
          <div>
            <BlogForm createBlog={addBlog} />
            <button onClick={() => setBlogFormVisible(false)}>cancel</button>
          </div>
        ) : (
          <button onClick={() => setBlogFormVisible(true)}>
            create new blog
          </button>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <div>
                {blogs.map((blog, index) => (
                  <Blog key={blog.id || index} blog={blog} />
                ))}
              </div>
            }
          />

          <Route path="/blogs/:id" element={<BlogDetails />} />

          <Route path="/users" element={<Users />} />

          <Route path="/users/:id" element={<UserBlogs />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
