const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();

router.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/', async (request, response) => {
  const { title, url, author } = request.body;

  if (!title || !url || !author) {
    return response.status(400).json({ error: 'Title, URL or author missing' });
  }

  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: 0,
      user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error saving blog:', error.message);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const user = request.user;
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'unauthorized' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } catch (error) {
    console.error('Error deleting blog:', error.message);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
