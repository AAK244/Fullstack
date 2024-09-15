import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, ListGroup, Row, Col, Card } from "react-bootstrap";
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
    <Container className="mt-5">
      <h2 className="text-center mb-4">{user.name}'s Blogs</h2>
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Blogs created by {user.name}</Card.Title>
              {blogs.length > 0 ? (
                <ListGroup variant="flush">
                  {blogs.map((blog) => (
                    <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No blogs added yet</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserBlogs;
