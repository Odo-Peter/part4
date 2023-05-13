const Blog = require('../models/blog');
const User = require('../models/user');

const intitialBlogs = [
  {
    title:
      'How to become a top notch developer and earn yourself some shillings by yours truly, the warden of the north',
    author: 'Odo Peter Ebere',
    url: 'http://localhost:3003/api/blogs',
    likes: 2,
  },
  {
    title:
      'Trying to become better at this software engineering thing, fighting my demons and praying I win, altering this to see where this goes',
    author: 'Odo Peter Ebere',
    url: 'http://localhost:3003/api/blogs',
    likes: 5,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'A test blog post from the helper function',
    author: 'Odo Peter Ebere',
    url: 'http://localhost:3003/api/blogs',
    likes: 5,
  });

  await blog.save();
  await blog.deleteOne();

  return blog.id;
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = { intitialBlogs, nonExistingId, blogsInDb, usersInDb };
