const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (req, res) => {
  Blog.find({}).then((result) => {
    res.json(result);
  });
});

blogRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((blog) => {
      blog ? res.json(blog) : res.status(404).end();
    })
    .catch((err) => next(err));
});

blogRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => next(err));
});

blogRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((blog) => {
      Blog.deleteOne(blog).then(() => {
        res.status(204).end();
      });
    })
    .catch((err) => next(err));
});

blogRouter.put('/:id', (req, res, next) => {
  const body = req.body;
  const id = req.params.id;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(id, blog, { new: true })
    .then((updatedBlog) => {
      res.json(updatedBlog);
    })
    .catch((err) => next(err));
});

module.exports = blogRouter;
