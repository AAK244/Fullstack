const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

router.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error saving blog:', error);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
