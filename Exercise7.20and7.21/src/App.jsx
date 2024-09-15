import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, Nav, Container, Button, Row, Col } from "react-bootstrap";
import { initializeBlogs, createBlog } from "./reducers/blogReducer";
import { setUser, logoutUser } from "./reducers/userReducer";
import blogService from "./services/blogs";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Users from "./components/Users";
import UserBlogs from "./components/UserBlogs";
import BlogDetails from "./components/BlogDetails";
import { showNotification } from "./reducers/notificationReducer";

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
    dispatch(createBlog(blogWithUser))
      .then(() => {
        dispatch(showNotification("Blog successfully created!", "success", 5));
      })
      .catch((error) => {
        dispatch(
          showNotification(
            `Failed to create blog: ${error.message}`,
            "error",
            5
          )
        );
      });
    setBlogFormVisible(false);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    dispatch(logoutUser());
    blogService.setToken(null);
  };

  const getNotificationClass = () => {
    if (notification.type === "success") {
      return "alert alert-success";
    } else if (notification.type === "error") {
      return "alert alert-danger";
    }
    return "";
  };

  if (!user) {
    return (
      <div>
        {notification.message && (
          <div className={getNotificationClass()}>{notification.message}</div>
        )}
        <LoginForm />
      </div>
    );
  }

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Blogs
            </Nav.Link>
            <Nav.Link as={Link} to="/users">
              Users
            </Nav.Link>
          </Nav>
          <Navbar.Text className="me-3">{user.name} logged in</Navbar.Text>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Container>
      </Navbar>

      <Container>
        {notification.message && (
          <div className={getNotificationClass()}>{notification.message}</div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h2>Blogs</h2>
                {blogFormVisible ? (
                  <div className="mb-4">
                    <BlogForm createBlog={addBlog} />
                    <Button
                      variant="secondary"
                      onClick={() => setBlogFormVisible(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setBlogFormVisible(true)}
                    className="mb-4"
                  >
                    Create new blog
                  </Button>
                )}
                <Row>
                  {blogs.map((blog, index) => (
                    <Col
                      key={blog.id || index}
                      xs={12}
                      md={6}
                      lg={4}
                      className="mb-4"
                    >
                      <Blog blog={blog} />
                    </Col>
                  ))}
                </Row>
              </>
            }
          />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserBlogs />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
