const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })  
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})

blogRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = request.user

  if (!request.token || !user.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ? body.likes : 0,
      user: user._id
  })

  if ( !blog.title || !blog.url ) {
    return response.status( 400 ).json({ error: 'Blog title or url is missing' });
  }

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.json(savedBlog.toJSON())
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = request.user

    if (!request.token || !user.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blogToDelete = await Blog.findById(request.params.id)

    if (blogToDelete.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'You do not have permission to delete this blog' })
    } 

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    id: body.id
  }

  await Blog.findByIdAndUpdate(request.params.id, blog)
  response.status(200).end()
})

module.exports = blogRouter