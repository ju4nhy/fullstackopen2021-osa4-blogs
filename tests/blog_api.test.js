const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('../utils/test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const { post } = require('../controllers/users')

let token = null

const initialBlogs = [
    {
      title: "Testiblog A",
      author: "Oliver Gibson",
      url: "https://www.blogggs.fi",
      likes: 10
    },
    {
      title: "Testiblog B",
      author: "Charles Roberts",
      url: "https://www.blogggss.fi/231",
      likes: 2
    }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

// Tehtävät 4.8 ja 4.9
describe('when there is some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('every blog has "id" field as identifier', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => expect(blog.id).toBeDefined())
  })
})

// Tehtävät 4.10, 4.11, 4.12
describe('when adding a blog entry', () => {
  beforeEach(async () => {
    const tester = {
      username: 'tester',
      name: 'Test User',
      password: '1234'
    }

    await api
      .post('/api/users')
      .send(tester)

    const loggedIn = await api
                      .post('/api/login')
                      .send({
                        username: 'tester',
                        password: '1234'
                      })

    token = loggedIn.body.token
  })

  test('a valid blog can be added', async () => {
      const testBlog = {
          title: 'Testiblog C',
          author: 'Trisha Roberts',
          url: 'https://www.sammycomcom.com/',
          likes: 7,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(testBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

      const blogTitles = blogsAtEnd.map(blog => blog.title)
      expect(blogTitles).toContain('Testiblog C')
  })

  test('if likes field is has no value, set its value to 0', async () => {
    // Blog without likes
    const testBlog = {
      title: 'Testiblog D',
      author: 'Andrew Reed',
      url: 'https://www.bobbybombom.com/'
    } 

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const blogLikes = blogsAtEnd.map(blog => blog.likes)
      expect(blogLikes).toContain(0)
  })

  test('blog without title is not added', async () => {
    const testBlog = {
      author: 'Steven Moss',
      url: 'https://www.bobbybombom.com/',
      likes: 2
    } 

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(testBlog)
      .expect(400) 
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const testBlog = {
      title: 'Testiblog E',
      author: 'Vivian Roberts',
      likes: 2
    } 

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(testBlog)
      .expect(400)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })

  test('adding blog fails if user is not authenticated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    token = ''

    const testBlog = {
        title: 'Testiblog C',
        author: 'Trisha Roberts',
        url: 'https://www.sammycomcom.com/',
        likes: 7,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

// Tehtävä 4.13
describe('when deleting a blog', () => {
  beforeEach(async () => {
    const tester = {
      username: 'tester',
      name: 'Test User',
      password: '1234'
    }

    const testBlog = {
      title: 'Test Blog To Delete',
      author: 'tester',
      url: 'https://www.testestesttest.com/',
      likes: 1000
  }

    await api
      .post('/api/users')
      .send(tester)

    const loggedIn = await api
                      .post('/api/login')
                      .send({
                        username: 'tester',
                        password: '1234'
                      })

    token = loggedIn.body.token

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(testBlog)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.filter(blog => blog.title === 'Test Blog To Delete')
    const blogId = blogToDelete.map(blog => blog.id)

      await api 
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  
    const blogTitles = blogsAtEnd.map(blog => blog.title)
    expect(blogTitles).not.toContain(blogToDelete.title)
  })

  test('a blog cannot be deleted without authorization', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    token = ''
  
    await api 
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(401)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  
    const blogTitles = blogsAtEnd.map(blog => blog.title)
    expect(blogTitles).toContain(blogToDelete.title)
  })
})

// Tehtävä 4.14
describe('when updating a blog', () => {
  test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 1000,
      id: blogToUpdate.id
    }

    await api 
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
     
    const blogsAtEnd = await helper.blogsInDb()
    const blogLikes = blogsAtEnd.map(blog => blog.likes)

    expect(blogLikes).toContain(updatedBlog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})