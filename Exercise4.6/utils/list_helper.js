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

  const authorCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    return counts;
  }, {});

  const maxBlogs = Math.max(...Object.values(authorCounts));
  const mostProlificAuthor = Object.keys(authorCounts).find(author => authorCounts[author] === maxBlogs);

  return {
    author: mostProlificAuthor,
    blogs: maxBlogs
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};
