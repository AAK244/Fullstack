import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog, deleteBlog } from "../reducers/blogReducer";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const loggedUser = useSelector((state) => state.user);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const likeBlog = () => {
    if (blog.id) {
      const updatedBlog = { ...blog, likes: (blog.likes || 0) + 1 };
      dispatch(updateBlog(blog.id, updatedBlog));
    } else {
      console.error("Blog id is undefined");
    }
  };

  const removeBlog = () => {
    if (blog.id) {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        dispatch(deleteBlog(blog.id));
      }
    } else {
      console.error("Blog id is undefined");
    }
  };

  return (
    <div>
      <div>
        {blog.title}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <p>URL: {blog.url}</p>
          <p>Author: {blog.author}</p>
          <p>
            Likes: {blog.likes || 0} <button onClick={likeBlog}>like</button>
          </p>

          {loggedUser.id === blog.userId && (
            <button onClick={removeBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
