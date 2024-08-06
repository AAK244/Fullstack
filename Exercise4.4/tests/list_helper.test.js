const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
  });
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ];

  const blogs = [
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
    },
    {
      title: 'Blog 3',
      author: 'Author 3',
      url: 'http://example.com/3',
      likes: 0
    }
  ];

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 15);
  });
});
