const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
 // const blogs = await Blog.find({})
 // response.json(blogs.map(blog => blog.toJSON()))

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

blogRouter.post('/', async (request, response, next) => {
    const body = request.body

    const user = await User.findById(body.userId)
    console.log(user)

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
    response.json(savedBlog)
    // response.json(savedBlog.toJSON())

      // user.blogs = user.blogs.concat(savedBlog._id)
   // await user.save()


    /*if (blog.likes == undefined || null) {
      blog['likes'] = 0
    }
    */
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

blogRouter.delete('/:id', async (request, response, next) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

module.exports = blogRouter