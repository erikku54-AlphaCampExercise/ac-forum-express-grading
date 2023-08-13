
const { Restaurant, Category, Comment, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const restaurantServices = {
  // (頁面) 瀏覽所有餐廳-首頁
  getRestaurants: (req, callback) => {
    const DEFAULT_LIMIT = 9
    // 空字串轉數字是0，是falsy，得到categoryId=''
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT

    const offset = getOffset(limit, page)

    return Promise.all([Restaurant.findAndCountAll({
      where: categoryId ? { categoryId } : {},
      raw: true,
      nest: true,
      include: Category,
      limit,
      offset
    }), Category.findAll({ raw: true })])
      .then(([restaurants, categories]) => {
        const FavoritedRestaurantsId = req.user?.FavoritedRestaurants
          ? req.user.FavoritedRestaurants.map(fr => fr.id)
          : []
        const LikedRestaurantsId = req.user?.LikedRestaurants
          ? req.user.LikedRestaurants.map(li => li.id)
          : []

        // 把餐廳敘述截至50個字，避免過長時版面亂掉
        const data = restaurants.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: FavoritedRestaurantsId.includes(r.id),
          isLiked: LikedRestaurantsId.includes(r.id)
        }))
        return callback(null, {
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => callback(err))
  }

}

module.exports = restaurantServices
