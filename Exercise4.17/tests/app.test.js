const supertest = require('supertest');
const http = require('http');
const { before, beforeEach, describe, test, after } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcrypt');

const Blog = require('../models/blog');
const User = require('../models/user');
const { connectToDatabase, disconnectFromDatabase } = require('../src/mongo');

let server;
let api;

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author 1',
    url: 'http://example.com/1',
    likes: 1,
  },
  {
    title: 'Second blog',
    author: 'Author 2',
    url: 'http://example.com/2',
    likes: 2,
  },
];

const initialUsers = [
  {
    username: 'testuser1',
    name: 'Test User 1',
    password: 'password123',
  },
  {
    username: 'testuser2',
    name: 'Test User 2',
    password: 'password123',
  },
];

before(async () => {
  const app = require('../src/index');
  server = http.createServer(app);
  await new Promise(resolve => server.listen(3004, resolve));
  api = supertest('http://localhost:3004');

  await connectToDatabase();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const userObjects = await Promise.all(initialUsers.map(async (user) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    return new User({
      username: user.username,
      name: user.name,
      passwordHash,
    });
  }));

  const savedUsers = await User.insertMany(userObjects);
  const userId = savedUsers[0]._id;

  const blogObjects = initialBlogs.map((blog) => new Blog({ ...blog, user: userId }));
  await Blog.insertMany(blogObjects);
});

describe('Blog API tests', () => {
  test('Blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('A specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);
    assert(titles.includes('First blog'));
  });

  test('A valid blog can be added', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'New Author',
      url: 'http://example.com/new',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1);

    const titles = blogsAtEnd.map((n) => n.title);
    assert(titles.includes('New blog'));
  });

  test('Blog without title cannot be added', async () => {
    const newBlog = {
      author: 'No Title Author',
      url: 'http://example.com/no-title',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });

  test('Blog without URL cannot be added', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'No URL Author',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length);
  });
});

describe('User API tests', () => {
  test('Users are returned as JSON', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('All users are returned', async () => {
    const response = await api.get('/api/users');
    assert.strictEqual(response.body.length, initialUsers.length);
  });

  test('A specific user is within the returned users', async () => {
    const response = await api.get('/api/users');
    const usernames = response.body.map((u) => u.username);
    assert(usernames.includes('testuser1'));
  });

  test('A valid user can be added', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'password123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, initialUsers.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes('newuser'));
  });

  test('User without username cannot be added', async () => {
    const newUser = {
      name: 'No Username User',
      password: 'password123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, initialUsers.length);
  });

  test('User with short username cannot be added', async () => {
    const newUser = {
      username: 'nu',
      name: 'Short Username',
      password: 'password123',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, initialUsers.length);
  });
});

after(async () => {
  await disconnectFromDatabase();
  if (server) {
    server.close();
  }
});
