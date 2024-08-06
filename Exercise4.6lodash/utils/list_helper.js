const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  return blogs.reduce((favorite, blog) => {
    return (blog.likes > favorite.likes) ? blog : favorite;
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, 'author');
  const mostProlificAuthor = _.maxBy(_.keys(authorCounts), author => authorCounts[author]);

  return {
    author: mostProlificAuthor,
    blogs: authorCounts[mostProlificAuthor]
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};
