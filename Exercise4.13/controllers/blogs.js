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
  const { title, url } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'Title or URL missing' });
  }

  try {
    const blog = new Blog(request.body);
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error saving blog:', error);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    console.error('Error deleting blog:', error);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
