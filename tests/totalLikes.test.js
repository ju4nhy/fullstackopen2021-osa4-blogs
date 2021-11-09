const listHelper = require('../utils/list_helper')
const blogList = require('../utils/bloglist')

describe('total likes', () => {
    test('of empty list is zero', () => {
      const result = listHelper.totalLikes([])
      expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(blogList.listWithOneBlog)
      expect(result).toBe(5)
    })

    test('of many items in list is calculated right', () => {
      const result = listHelper.totalLikes(blogList.blogs)
      expect(result).toBe(36)
    })
})