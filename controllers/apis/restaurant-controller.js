
// const { Restaurant, Category, Comment, User } = require('../../models')
// const { getOffset, getPagination } = require('../../helpers/pagination-helpers')

const restaurantServices = require('../../services/restaurant-services')

const restaurantController = {
  // (頁面) 瀏覽所有餐廳-首頁
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = restaurantController
