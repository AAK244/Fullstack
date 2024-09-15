import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{blog.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          by {blog.author}
        </Card.Subtitle>
        <Card.Text>
          This blog was created by {blog.author}. Click below to see more
          details.
        </Card.Text>
        <Link to={`/blogs/${blog.id}`}>
          <Button variant="primary">View Blog</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Blog;
