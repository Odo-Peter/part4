const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument', process.argv);
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.hypngr7.mongodb.net/testBlogListApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

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

const Blog = mongoose.model('Blog', blogSchema);

const blog = new Blog({
  title:
    'Trying to become better at this software engineering thing, fighting my demons and praying I win',
  author: 'Odo Peter Ebere',
  url: 'http://localhost:3003/api/blogs',
  likes: 5,
  id: '641dfa0560ee8b7d738cc37c',
});

blog.save().then(() => {
  console.log('note saved');
  mongoose.connection.close();
});

// Note.find({ content: 'It is better with Mongoose' }).then((result) => {
//   result.forEach((note) => {
//     console.log(note);
//   });
//   mongoose.connection.close();
// });
