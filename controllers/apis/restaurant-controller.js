
const { Restaurant, Category, Comment, User } = require('../../models')
const { getOffset, getPagination } = require('../../helpers/pagination-helpers')

const restaurantController = {
  // (頁面) 瀏覽所有餐廳-首頁
  getRestaurants: (req, res, next) => {
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
        return res.json({
          restaurants: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, restaurants.count)
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
