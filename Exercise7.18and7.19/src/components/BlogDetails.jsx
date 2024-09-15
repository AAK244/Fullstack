import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import blogService from "../services/blogs";
import { updateBlog } from "../reducers/blogReducer";

const BlogDetails = () => {
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState("");
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

  const addComment = (event) => {
    event.preventDefault();
    if (comment.trim()) {
      blogService
        .addComment(id, comment)
        .then((updatedBlog) => {
          setBlog(updatedBlog);
          setComment("");
        })
        .catch((error) => {
          console.error("Failed to add comment:", error);
        });
    } else {
      console.error("Comment cannot be empty");
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

      <h3>Comments</h3>
      <ul>
        {(blog.comments || []).map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>

      <form onSubmit={addComment}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="add comment"
        />
        <button type="submit">add comment</button>
      </form>
    </div>
  );
};

export default BlogDetails;
