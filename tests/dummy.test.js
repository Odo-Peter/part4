const listHelper = require('../utils/list_helper');

describe('dummy blog counts', () => {
  test('dummy returns one', () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });

  test('dummy returns the total number of blogs', () => {
    const blogs = [1, 2, 3, 4, 5, 6];
    const result = listHelper.dummy(blogs);
    expect(result).toBe(21);
  });
});

describe('total likes count', () => {
  test('returns 5 likes', () => {
    const oneBlogPost = [
      {
        title:
          'How to become a top notch developer and earn yourself some shillings by yours truly, the warden of the north',
        author: 'Odo Peter Ebere',
        url: 'http://localhost:3003/api/blogs',
        likes: 5,
        id: '63f493cf48b941f08f8964d8',
      },
    ];
    const result = listHelper.totalLikes(oneBlogPost);
    expect(result).toBe(5);
  });

  test('returns total of 7 likes', () => {
    const totalBlogPost = [
      {
        title:
          'This is the first blog post sent to the database from the rest client of VScode',
        author: 'Odo Peter Ebere',
        url: 'http://localhost:3003/api/blogs',
        likes: 3,
        id: '63f484ba95afc13d6127e7bb',
      },
      {
        title:
          'This is another blog post sent to the database from the rest client of VScode, this is speaking about how I am improving my backend skills and my technical writing skills, which seems to be doing terrible at the moment',
        author: 'Odo Peter Ebere',
        url: 'http://localhost:3003/api/blogs',
        likes: 2,
        id: '63f485936e1c1df04156dc63',
      },
      {
        title:
          'How to become a top notch developer and earn yourself some shillings by yours truly, the warden of the north',
        author: 'Odo Peter Ebere',
        url: 'http://localhost:3003/api/blogs',
        likes: 2,
        id: '63f493cf48b941f08f8964d8',
      },
    ];
    const result = listHelper.totalLikes(totalBlogPost);
    expect(result).toBe(7);
  });
});

describe('most liked blog', () => {
  test('blog with hightest likes', () => {
    const mostLikedBlog = [
      {
        title:
          'This is the first blog post sent to the database from the rest client of VScode',
        author: 'Odo Peter Ebere',
        url: 'http://localhost:3003/api/blogs',
        likes: 7,
        id: '63f484ba95afc13d6127e7bb',
      },
    ];
    const totalBlogPost = [
      {
        title:
          'This is the first blog post sent to the database from the rest client of VScode',
        author: 'Odo Peter Ebere',
        url: 'http://localhost:3003/api/blogs',
        likes: 7,
        id: '63f484ba95afc13d6127e7bb',
      },
      {
        title:
          'This is another blog post sent to the database from the rest client of VScode, this is speaking about how I am improving my backend skills and my technical writing skills, which seems to be doing terrible at the moment',
        author: 'Odo Peter Ebere',
        url: 'http://localhost:3003/api/blogs',
        likes: 2,
        id: '63f485936e1c1df04156dc63',
      },
      {
        title:
          'How to become a top notch developer and earn yourself some shillings by yours truly, the warden of the north',
        author: 'Odo Peter Ebere',
        url: 'http://localhost:3003/api/blogs',
        likes: 2,
        id: '63f493cf48b941f08f8964d8',
      },
    ];
    const result = listHelper.favoriteBlog(totalBlogPost);
    expect(result).toEqual(mostLikedBlog);
  });
});
