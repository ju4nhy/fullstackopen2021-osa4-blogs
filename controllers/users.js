const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body
 
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  if (user.username === 'asd') {
    return response.status(400).json({ error: 'username to be unique' })
  }
                
  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
 // const users = await User.find({}).populate('blogs')
 //  response.json(users.map(u => u.toJSON()))
 const users = await User.find({})
 response.json(users.map((u) => u.toJSON()))
})

module.exports = usersRouter