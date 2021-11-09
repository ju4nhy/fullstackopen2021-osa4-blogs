const listHelper = require('../utils/list_helper')
const blogList = require('../utils/bloglist')

describe('most likes', () => {
    test('of empty list is empty object', () => {
        const result = listHelper.mostLikes([])
        expect(result).toEqual({})
    })
    
    test('when list has only one blog equals', () => {
        const result = listHelper.mostLikes(blogList.listWithOneBlog)
        const authorWithMostLikes = {
            author: blogList.listWithOneBlog[0].author,
            likes: 5
        }
        expect(result).toEqual(authorWithMostLikes)
    })
   
    test('of a bigger list is the blogger with the most likes', () => {
      const result = listHelper.mostLikes(blogList.blogs)
      expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
      })
    })   
})
