const express = require('express');
const app = express();
const cors = require('cors');
const { connectToDatabase } = require('./mongo'); 
const blogsRouter = require('../controllers/blogs');
const usersRouter = require('../controllers/users');
const { tokenExtractor, userExtractor } = require('../middlewares/tokenExtractor');

app.use(cors());
app.use(express.json());
app.use(tokenExtractor);

app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter); 

const PORT = process.env.NODE_ENV !== 'test' ? process.env.PORT || 3003 : 3004;
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
