import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/users";
import blogService from "../services/blogs";

const UserBlogs = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    userService.getUserById(id).then((userData) => {
      setUser(userData);

      const blogIds = userData.blogs;
      Promise.all(blogIds.map(blogService.getById)).then((fetchedBlogs) => {
        setBlogs(fetchedBlogs);
      });
    });
  }, [id]);

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {blogs.length > 0 ? (
          blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)
        ) : (
          <li>No blogs added yet</li>
        )}
      </ul>
    </div>
  );
};

export default UserBlogs;
