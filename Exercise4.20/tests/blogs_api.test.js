const mongoose = require('mongoose');
const supertest = require('supertest');
const { before, beforeEach, describe, test, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const bcrypt = require('bcrypt');

let server;
let api;

const User = require('../models/user');
const Blog = require('../models/blog');

before(async () => {
  const app = require('../src/index');
  const SECRET = 'your_secret_key_here';
  process.env.SECRET = SECRET;
  server = http.createServer(app);
  await new Promise(resolve => server.listen(3004, resolve));
  api = supertest('http://localhost:3004');
});

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash('password', 10);
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash
  });

  const savedUser = await user.save();

  const blog = new Blog({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: savedUser._id
  });

  const savedBlog = await blog.save();

  savedUser.blogs = savedUser.blogs.concat(savedBlog._id);
  await savedUser.save();
});

describe('Blog API', () => {
  test('blogs are returned with user information', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;

    assert.strictEqual(blogs.length, 1);
    assert.strictEqual(blogs[0].title, 'Test Blog');
    assert.strictEqual(blogs[0].user.username, 'testuser');
  });

  test('users are returned with blogs', async () => {
    const response = await api.get('/api/users');
    const users = response.body;

    assert.strictEqual(users.length, 1);
    assert.strictEqual(users[0].username, 'testuser');
    assert.strictEqual(users[0].blogs.length, 1);
    assert.strictEqual(users[0].blogs[0].title, 'Test Blog');
  });

  test('a valid token is required to add a blog', async () => {
    const loginResponse = await api
      .post('/api/users/login')
      .send({ username: 'testuser', password: 'password' });
    
    const token = loginResponse.body.token;

    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newurl.com',
      likes: 0
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.title, 'New Blog');
    assert.strictEqual(response.body.author, 'New Author');
  });

  test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newurl.com',
      likes: 0
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  });
});

after(async () => {
  await mongoose.connection.close();
  if (server) {
    server.close();
  }
});
