import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Container, Card, Button, Form, ListGroup } from "react-bootstrap";
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
    <Container className="mt-5">
      <Card>
        <Card.Body>
          <Card.Title>{blog.title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted">
            by {blog.author}
          </Card.Subtitle>
          <Card.Text>
            URL:{" "}
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </Card.Text>
          <Card.Text>
            Likes: {blog.likes}{" "}
            <Button variant="primary" onClick={likeBlog}>
              Like
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-4">Comments</h3>
      <ListGroup className="mb-4">
        {(blog.comments || []).map((comment, index) => (
          <ListGroup.Item key={index}>{comment}</ListGroup.Item>
        ))}
      </ListGroup>

      <Form onSubmit={addComment}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Comment
        </Button>
      </Form>
    </Container>
  );
};

export default BlogDetails;
