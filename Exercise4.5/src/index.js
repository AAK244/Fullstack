const express = require('express');
const app = express();
const cors = require('cors');
require('./mongo');
const blogsRouter = require('../controllers/blogs');

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Hello, World!</h1>');
});

app.use('/api/blogs', blogsRouter);

app.use((req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
