const mongoose = require('mongoose');
const supertest = require('supertest');
const { before, beforeEach, describe, test, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');

let server;
let api;

const User = require('../models/user');
const Blog = require('../models/blog');

before(async () => {
  const app = require('../src/index');
  server = http.createServer(app);
  await new Promise(resolve => server.listen(3004, resolve));
  api = supertest('http://localhost:3004');
});

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
});

describe('User creation', () => {
  test('a valid user can be added', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/users');
    const usernames = response.body.map(r => r.username);

    assert.strictEqual(usernames.length, 1);
    assert(usernames.includes(newUser.username));
  });

  test('fails with status code 400 if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'password'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with status code 400 if password is missing', async () => {
    const newUser = {
      username: 'nopassword',
      name: 'No Password'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('Blog tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Author',
      url: 'http://example.com',
      likes: 5
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);

    assert.strictEqual(titles.length, 1);
    assert(titles.includes(newBlog.title));
  });

  test('a blog can be deleted', async () => {
    const newBlog = new Blog({
      title: 'Blog to be deleted',
      author: 'Author',
      url: 'http://example.com',
      likes: 0
    });
    await newBlog.save();

    await api
      .delete(`/api/blogs/${newBlog.id}`)
      .expect(204);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);

    assert.strictEqual(titles.length, 0);
  });

  test('a blog can be updated', async () => {
    const newBlog = new Blog({
      title: 'Blog to be updated',
      author: 'Author',
      url: 'http://example.com',
      likes: 0
    });
    await newBlog.save();

    const updatedBlog = {
      title: 'Updated Blog',
      author: 'Updated Author',
      url: 'http://example.com',
      likes: 10
    };

    await api
      .put(`/api/blogs/${newBlog.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);

    assert.strictEqual(titles.length, 1);
    assert(titles.includes(updatedBlog.title));
  });
});

after(async () => {
  await mongoose.connection.close();
  if (server) {
    server.close();
  }
});
