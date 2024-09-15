import React from 'react';

const Blog = ({ blog }) => (
  <div>
    <h3>{blog.title}</h3>
    <p>by {blog.author}</p>
    <p><a href={blog.url}>{blog.url}</a></p>
  </div>
);

export default Blog;
