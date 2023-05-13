const logger = require('../utils/logger');
const config = require('../utils/config');

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const Url = config.MONGODB_URI;

logger.info('connecting to .... MONGODB');

mongoose
  .connect(Url)
  .then(() => logger.info('connected to MONGODB successfully'))
  .catch((err) => logger.error('Error connecting to MONGODB: ', err));

//making the mongoose schema
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: String,
    url: { type: String, required: true },
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

blogSchema.set('toJSON', {
  transform: (document, returnedBlog) => {
    returnedBlog.id = returnedBlog._id.toString();
    delete returnedBlog._id;
    delete returnedBlog.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
