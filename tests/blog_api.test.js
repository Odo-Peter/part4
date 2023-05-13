const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

const blogID = (blog) => {
  const id = blog.map((c) => c.id);
  return id;
};

const blogLikes = (blog) => {
  blog.likes === undefined ? (blog.likes = 0) : blog.likes;
};

let userToken = '';

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const blogObjects = helper.intitialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());

  await Promise.all(promiseArray);

  const testUser = {
    username: 'Sir Hodor',
    name: 'Hodor Snow',
    password: '123456',
  };

  await api.post('/api/users').send(testUser);

  const {
    body: { token },
  } = await api.post('/api/login').send(testUser);

  userToken = token;
}, 100000);

describe('When testing with a token based authentication for adding a new blog', () => {
  test('Verifying a token-based HTTP POST request', async () => {
    const newBlog = {
      title: 'This is a test blog, sent from the test block',
      author: 'Odo Peter Ebere',
      url: 'http://localhost:3003/api/blogs',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const res = await api.get('/api/blogs');
    const contents = res.body.map((r) => r.title);

    expect(res.body).toHaveLength(helper.intitialBlogs.length + 1);
    expect(contents).toContain('This is a test blog, sent from the test block');
  }, 100000);

  test('When token is not provided while adding a new blog', async () => {
    const newBlog = {
      title: 'This is a test blog, sent from the test block',
      author: 'Odo Peter Ebere',
      url: 'http://localhost:3003/api/blogs',
      likes: 2,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(helper.intitialBlogs.length);
  });
});

describe('When there is initially some blogs saved and some properites being checked', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 100000);

  test('The length of the blogs', async () => {
    const res = await api.get('/api/blogs');
    expect(res.body).toHaveLength(helper.intitialBlogs.length);
  }, 100000);

  test('verifies the unique identifier', async () => {
    const res = await api.get('/api/blogs');

    expect(blogID(res.body)).toBeDefined();
  }, 100000);

  test('Verifying a HTTP POST request', async () => {
    const newBlog = {
      title: 'This is a test blog, sent from the test block',
      author: 'Odo Peter Ebere',
      url: 'http://localhost:3003/api/blogs',
      likes: 2,
      userId: '645acf112cb7f574fb4c2fc0',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const res = await api.get('/api/blogs');
    const contents = res.body.map((r) => r.title);

    expect(res.body).toHaveLength(helper.intitialBlogs.length + 1);
    expect(contents).toContain('This is a test blog, sent from the test block');
  }, 100000);

  test('check if the likes property is missing', async () => {
    const newBlog = {
      title: 'This is a test blog, with zero likes',
      author: 'Odo Peter Ebere',
      url: 'http://localhost:3003/api/blogs',
    };

    blogLikes(newBlog);

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(newBlog.likes).toBe(0);
  });

  test('Check when a bad request is sent', async () => {
    const newBlog = {
      url: 'http://localhost:3003/api/blogs',
      likes: 4,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);

    const res = await api.get('/api/blogs');

    expect(res.body).toHaveLength(helper.intitialBlogs.length);
  }, 100000);
});

describe('deletion of a single blog post', () => {
  test('proceeds to status code 204, blog being deleted', async () => {
    const blogAtStart = await helper.blogsInDb();
    const blogToDelete = blogAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogAtEnd = await helper.blogsInDb();

    expect(blogAtEnd).toHaveLength(helper.intitialBlogs.length - 1);

    const blogContents = blogAtEnd.map((blog) => blog.title);

    expect(blogContents).not.toContain(blogToDelete.title);
  });
});

describe('alterations of a blog post', () => {
  test('update number of likes on a specific blog post', async () => {
    const newLikes = 10;
    const updateLikes = (blog) => {
      const updateBlog = { ...blog, likes: newLikes };
      return updateBlog;
    };

    const blogsBefore = await helper.blogsInDb();
    const blogToBeUpdated = blogsBefore[0];

    const updatedBlog = updateLikes(blogToBeUpdated);

    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect('Content-Type', /application\/json/)
      .expect(200);

    const blogAfter = await helper.blogsInDb();
    const nowUpdatedLike = blogAfter[0].likes;
    expect(nowUpdatedLike).toBe(newLikes);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Odo-Peter',
      name: 'Odo Peter',
      password: '123456',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  }, 100000);
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'Odo-Peteru', passwordHash });

    await user.save();
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Odo-Peteru',
      name: 'Odo Peteru',
      password: '123456',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('creation fails with proper statuscode and message if username or password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'Od',
      name: 'Odo Peteru',
      password: '12',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(403)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'credentials should be above 3 characters'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
