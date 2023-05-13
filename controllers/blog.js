const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  });

  res.json(blogs);
});

blogRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const returnedBlog = await Blog.findById(id);
  returnedBlog ? res.json(returnedBlog) : res.status(404).end;
});

blogRouter.post('/', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;

  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  const newBlog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user.id,
  });

  const savedBlog = await newBlog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogRouter.delete('/:id', userExtractor, async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  const user = req.user;

  if (!(blog.user.toString() === user.id.toString())) {
    return res
      .status(405)
      .json({ error: 'Not allowed to delete someone else post' });
  }

  await Blog.findByIdAndDelete(id);
  res.status(204).end();
});

blogRouter.put('/:id', async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
  res.json(updatedBlog);
});

module.exports = blogRouter;
