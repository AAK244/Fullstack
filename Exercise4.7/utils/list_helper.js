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

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;

  const authorLikes = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes;
    return likes;
  }, {});

  const maxLikes = Math.max(...Object.values(authorLikes));
  const mostLikedAuthor = Object.keys(authorLikes).find(author => authorLikes[author] === maxLikes);

  return {
    author: mostLikedAuthor,
    likes: maxLikes
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
