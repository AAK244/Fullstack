import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import blogService from "../services/blogs";
import { updateBlog } from "../reducers/blogReducer";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getById(id).then((returnedBlog) => {
      setBlog(returnedBlog);
    });
  }, [id]);

  const likeBlog = () => {
    if (blog) {
      const updatedBlog = { ...blog, likes: blog.likes + 1 };
      dispatch(updateBlog(blog.id, updatedBlog));
      setBlog(updatedBlog);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>Author: {blog.author}</p>
      <p>Added by: {blog.user ? blog.user.name : "Unknown"}</p>
      <p>
        URL:{" "}
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </p>
      <p>
        Likes: {blog.likes} <button onClick={likeBlog}>like</button>
      </p>
    </div>
  );
};

export default BlogDetails;
