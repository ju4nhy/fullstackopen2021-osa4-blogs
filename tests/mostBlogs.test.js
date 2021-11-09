const listHelper = require('../utils/list_helper')
const blogList = require('../utils/bloglist')

describe('most blogs', () => {
    test('of empty list is empty object', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toEqual({})
    })
    
    test('when list has only one blog equals', () => {
        const result = listHelper.mostBlogs(blogList.listWithOneBlog)
        const authorWithMostBlogs = {
            author: blogList.listWithOneBlog[0].author,
            blogs: 1
        }
        expect(result).toEqual(authorWithMostBlogs)
    })
   
    test('of a bigger list is the blogger with the most likes', () => {
      const result = listHelper.mostBlogs(blogList.blogs)
      expect(result).toEqual({
          author: 'Robert C. Martin',
          blogs: 3
      })
    })   
})
