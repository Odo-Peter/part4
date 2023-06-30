const express = require('express');
require('express-async-errors');

const app = express();
const cors = require('cors');
const morgan = require('morgan');

const blogRouter = require('./controllers/blog');
const userRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(middleware.tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}
app.use(middleware.errorHandler);

module.exports = app;
