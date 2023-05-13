const dummy = (blogs) => {
  const reducer = (sum, item) => sum + item;
  return blogs.length === 0 ? 1 : blogs.reduce(reducer, 0);
};

const totalLikes = (blogs) => {
  const likesArr = blogs.map((blog) => blog.likes);
  const reducer = likesArr.reduce((a, b) => a + b, 0);

  return likesArr.length === 1 ? likesArr[0] : reducer;
};

const favoriteBlog = (blogs) => {
  const bloglikes = blogs.map((blog) => blog.likes);
  const highestLike = Math.max(...bloglikes);

  const filteredByLikes = blogs.filter((blog) => blog.likes === highestLike);
  // console.log(filteredByLikes[0].likes);
  return blogs.length === 0 ? 1 : filteredByLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
