const express = require('express');
const app = express();
const cors = require('cors');
require('./mongo');
const blogsRouter = require('../controllers/blogs');
const usersRouter = require('../controllers/users');
const { tokenExtractor, userExtractor } = require('../middlewares/tokenExtractor');

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.NODE_ENV !== 'test' ? process.env.PORT || 3003 : 3004;
const SECRET = process.env.SECRET || 'your_secret_key_here';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
module.exports.SECRET = SECRET;
