import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
app.use(bodyParser.json());

const users = [
  {
    id: 1,
    username: 'mluukkai',
    passwordHash:
      '$2b$10$OusGARi3Nkm5NZRLtktVQ.96LFea80YfYs94AUaqk9k3KdU4tCilO',
  },
];

const SECRET = 'my_secret_key';

const getBlogs = () => {
  const data = fs.readFileSync('backend/db.json');
  return JSON.parse(data).blogs;
};

const saveBlogs = (blogs) => {
  const data = JSON.stringify({ blogs }, null, 2);
  fs.writeFileSync('backend/db.json', data);
};

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  const passwordCorrect =
    user === undefined
      ? false
      : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  res
    .status(200)
    .send({ token, username: user.username, name: 'Matti Luukkainen' });
});

app.get('/api/blogs', (req, res) => {
  const blogs = getBlogs();
  res.json(blogs);
});

app.post('/api/blogs', (req, res) => {
  const body = req.body;

  if (!body.title || !body.author || !body.url) {
    return res.status(400).json({
      error: 'title, author, or url missing',
    });
  }

  const blogs = getBlogs();

  const blog = {
    id: Math.floor(Math.random() * 10000),
    title: body.title,
    author: body.author,
    url: body.url,
    likes: 0,
    user: body.user,
  };

  blogs.push(blog);
  saveBlogs(blogs);

  res.status(201).json(blog);
});

app.put('/api/blogs/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const body = req.body;

  const blogs = getBlogs();
  const blogIndex = blogs.findIndex((blog) => blog.id === id);

  if (blogIndex === -1) {
    return res.status(404).json({ error: 'blog not found' });
  }

  const updatedBlog = {
    ...blogs[blogIndex],
    likes: body.likes,
    user: body.user,
  };

  blogs[blogIndex] = updatedBlog;
  saveBlogs(blogs);

  res.json(updatedBlog);
});

app.delete('/api/blogs/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let blogs = getBlogs();

  blogs = blogs.filter((blog) => blog.id !== id);
  saveBlogs(blogs);

  res.status(204).end();
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
