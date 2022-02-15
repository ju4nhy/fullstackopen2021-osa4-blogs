const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body
  const username = body.username

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  if (!body.password || body.password.length < 3 ) {
    return response.status(400).json({ error: 'Password is missing or it is too short. Minimum allowed length is 3.' });
  }
 
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })
                
  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
 
 // const users = await User.find({})
 // response.json(users.map((u) => u.toJSON()))
})

module.exports = usersRouter