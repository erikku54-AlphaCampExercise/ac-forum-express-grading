
const { Restaurant, Category, Comment, User } = require('../../models')
// const { getOffset, getPagination } = require('../../helpers/pagination-helpers')

const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  // (頁面) 瀏覽所有餐廳-首頁
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('restaurants', data))
  },
  // (頁面) 瀏覽單一餐廳資料
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      {
        include: [Category,
          { model: Comment, include: User },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ],
        nest: true
      })
      .then(restaurant => {
        // console.log(restaurant.Comments[0].dataValues) // 此時還不是plain OBJ，加.dataValues取值
        const isFavorited = restaurant.FavoritedUsers.some(fr => fr.id === req.user.id)
        const isLiked = restaurant.LikedUsers.some(li => li.id === req.user.id)

        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.increment({ viewCounts: 1 })
          .then(() => res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked }))
      })
      .catch(err => next(err))
  },
  // (頁面) 顯示單一餐廳的Dashboard
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id,
      { nest: true, include: [Category, Comment, { model: User, as: 'FavoritedUsers' }] })
      .then(restaurant => res.render('dashboard', { restaurant: restaurant.toJSON() }))
      .catch(err => next(err))
  },
  // (頁面) 顯示最新消息
  getFeeds: (req, res, next) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant],
        raw: true,
        nest: true
      })
    ])
      .then(([restaurants, comments]) => res.render('feeds', { restaurants, comments }))
      .catch(err => next(err))
  },
  // (頁面) 顯示top restaurants
  getTopRestaurants: (req, res, next) => {
    return Restaurant.findAll({ nest: true, include: [Category, { model: User, as: 'FavoritedUsers' }] })
      .then(restaurants => {
        // 整理資料，排序後取出前10筆
        restaurants = restaurants
          .map(restaurant => ({
            ...restaurant.toJSON(),
            favoritedCount: restaurant.FavoritedUsers.length,
            categoryName: restaurant.Category ? restaurant.Category.dataValues.name : '未分類', // 不加'restaurant.Category ? :'測試會報錯
            isFavorited: req.user && restaurant.FavoritedUsers.some(user => user.id === req.user.id) // 不加'req.user && '測試會報錯
          }))
          .sort((a, b) => b.favoritedCount - a.favoritedCount)
          .slice(0, 10)

        // console.log(restaurants)

        return res.render('top-restaurants', { restaurants })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
