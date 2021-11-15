const Blog = require('../models/blog')

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'Esko Nevski', url: 'https://www.testitestitesti.fi' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  nonExistingId, blogsInDb
}