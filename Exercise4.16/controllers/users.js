const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || username.length < 3) {
    return response.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long' });
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
    if (error.name === 'MongoServerError' && error.code === 11000) {
      response.status(400).json({ error: 'Username must be unique' });
    } else {
      response.status(500).json({ error: 'Something went wrong' });
    }
  }
});

router.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = router;
