const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');
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
    const users = await User.find({});
    const user = users[0]; 

    const blog = new Blog({
      ...request.body,
      user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error saving blog:', error);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
