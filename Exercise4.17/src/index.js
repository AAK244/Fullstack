const express = require('express');
const app = express();
const cors = require('cors');
const { connectToDatabase } = require('./mongo');

connectToDatabase();

const blogsRouter = require('../controllers/blogs');
const usersRouter = require('../controllers/users');

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.NODE_ENV !== 'test' ? process.env.PORT || 3003 : 3004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
