const logger = require('../utils/logger');
const config = require('../utils/config');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const Url = config.MONGODB_URI;

console.log('connecting to .... MONGODB', Url);

mongoose
  .connect(Url)
  .then(() => logger.info('connected to MONGODB successfully'))
  .catch((err) => logger.error('Error connecting to MONGODB: ', err));

//making the mongoose schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedBlog) => {
    returnedBlog.id = returnedBlog._id.toString();
    delete returnedBlog._id;
    delete returnedBlog.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
