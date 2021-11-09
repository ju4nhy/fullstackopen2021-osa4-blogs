const listHelper = require('../utils/list_helper')
const blogList = require('../utils/bloglist')

describe('favorite blog', () => {
    test('of empty list is empty object', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toEqual({})
    })
    
    test('when list has only one blog equals', () => {
        const result = listHelper.favoriteBlog(blogList.listWithOneBlog)
        expect(result).toEqual(blogList.listWithOneBlog[0])
    })
    
    test('of a bigger list is the blog with the most likes', () => {
      const result = listHelper.favoriteBlog(blogList.blogs)
      expect(result).toEqual({
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
      })
    })
})
