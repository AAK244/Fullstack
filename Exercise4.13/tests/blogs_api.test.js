const mongoose = require('mongoose');
const supertest = require('supertest');
const { before, beforeEach, describe, test, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');

let server;
let api;

const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Author 1',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Blog 2',
    author: 'Author 2',
    url: 'http://example.com/2',
    likes: 10
  }
];

before(async () => {
  const app = require('../src/index'); 
  server = http.createServer(app);
  await new Promise(resolve => server.listen(3004, resolve)); 
  api = supertest(`http://localhost:3004`);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://example.com/new',
      likes: 3
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    assert(titles.includes(newBlog.title));
  });

  test('blog identifier property is named id', async () => {
    const response = await api.get('/api/blogs');
    const ids = response.body.map(blog => blog.id);
    
    ids.forEach(id => {
      assert(id);
    });
  });

  test('adding a blog post increases the total number of blogs by one', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://example.com/test',
      likes: 7
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map(r => r.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    assert(titles.includes(newBlog.title));
  });

  test('default value of likes is 0 if the property is missing', async () => {
    const newBlog = {
      title: 'Blog Without Likes',
      author: 'Test Author',
      url: 'http://example.com/test-likes'
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test('fails with status code 400 if title is missing', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'http://example.com/test-title'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('fails with status code 400 if url is missing', async () => {
    const newBlog = {
      title: 'Missing URL Blog',
      author: 'Test Author'
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });

  test('a blog can be deleted', async () => {
    const response = await api.get('/api/blogs');
    const blogToDelete = response.body[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    const finalBlogs = await api.get('/api/blogs');
    assert.strictEqual(finalBlogs.body.length, initialBlogs.length - 1);

    const titles = finalBlogs.body.map(r => r.title);
    assert(!titles.includes(blogToDelete.title));
  });
});

after(async () => {
  await mongoose.connection.close();
  server.close();
});
