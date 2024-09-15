import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

async function createUsers() {
  const users = [
    {
      id: 1,
      username: 'mluukkai',
      passwordHash: '$2b$10$OusGARi3Nkm5NZRLtktVQ.96LFea80YfYs94AUaqk9k3KdU4tCilO' // 'password'
    },
    {
      id: 2,
      username: 'differentuser',
      passwordHash: await bcrypt.hash('salasana', 10) // 'salasana'
    }
  ];
  return users;
}

const users = await createUsers();

const SECRET = 'my_secret_key';

mongoose.connect('mongodb+srv://AAK24:u5RNYCee3FNANveZ@aak.w8fonht.mongodb.net/Part5?retryWrites=true&w=majority&appName=AAK')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    username: String,
    name: String,
    token: String,
  },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = mongoose.model('Blog', blogSchema);

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  const passwordCorrect = user === undefined
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  res.status(200).send({ token, username: user.username, name: user.username });
});

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Fetching blogs failed' });
  }
});

app.post('/api/blogs', async (req, res) => {
  const body = req.body;

  if (!body.title || !body.author || !body.url) {
    return res.status(400).json({
      error: 'title, author, or url missing'
    });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: body.user,
  });

  try {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ error: 'Saving blog failed' });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes: body.likes, user: body.user }, { new: true });
    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).json({ error: 'blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Updating blog failed' });
  }
});

app.delete('/api/blogs/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (blog) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: `Deleting blog failed: ${error.message}` });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
