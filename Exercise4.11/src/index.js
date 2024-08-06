const express = require('express');
const app = express();
const cors = require('cors');
require('./mongo'); 
const blogsRouter = require('../controllers/blogs');

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3003;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
