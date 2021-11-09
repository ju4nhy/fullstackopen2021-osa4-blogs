var _ = require('lodash');

  // just for testing purposes...
  const dummy = (blogs) => {
    return 1
  }

  // total likes of all blogs
  const totalLikes = (blogs) => {
    const allLikes = blogs.reduce((sum, blog) => {
      return sum + blog.likes
    }, 0)
    return allLikes
  }
  
  // blog with most likes
  const favoriteBlog = (blogs) => {
    const blogWithMostLikes = blogs.reduce((a, b) => (a.likes > b.likes) ? a : b, {})
    return blogWithMostLikes
  }
  
  // author with most blogs
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
      return {}
    }

    const authorList = _.map(blogs, 'author')
    const blogObject = _.countBy(authorList)
    let values = Object.values(blogObject)
    let maxBlogCount = Math.max(...values)
    let authorWithMostBlogs = Object.keys(blogObject).reduce((previous, current) => blogObject[previous] > blogObject[current] ? previous : current)

    return { 
      author: authorWithMostBlogs, 
      blogs: maxBlogCount 
    }
  }

  // author with most likes
  const mostLikes = (blogs) => {
    if (blogs.length === 0) {
      return {}
    }
    
    let authorsWithLikes = blogs.reduce((blog, {author, likes}) => {
      blog[author] = blog[author] || 0
      blog[author] += likes
      return blog
    }, {})
  
    const mostLikes = _.max(Object.values(authorsWithLikes))
    const authorWithMostLikes = Object.keys(authorsWithLikes).find(key => authorsWithLikes[key] === mostLikes)

      return {
        author: authorWithMostLikes, 
        likes: mostLikes
      }
  }

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }