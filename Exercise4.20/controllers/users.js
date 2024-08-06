const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router(); 

const SECRET = 'your_secret_key_here';

router.get('/', async (request, response) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 });
    response.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'Username or password missing' });
  }

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({ error: 'Username and password must be at least 3 characters long' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error.message);
    response.status(500).json({ error: 'Something went wrong' });
  }
});

router.post('/login', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
