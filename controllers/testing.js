const testingRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

testingRouter.post('/reset', async (req, res) => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  console.log('also here');

  res.status(204).end();
});

testingRouter.get('/reset', async (req, res) => {
  res.send('<h1>This should work</h1>');
});

module.exports = testingRouter;
