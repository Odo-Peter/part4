const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const blogRouter = require('./controllers/blog');
const middleware = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.use('/api/blogs', blogRouter);
app.use(middleware.errorHandler);

module.exports = app;
