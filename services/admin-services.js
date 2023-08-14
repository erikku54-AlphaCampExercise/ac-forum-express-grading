
const { Restaurant, User, Category } = require('../models')

// const { imgurFileHandler } = require('../../helpers/file-helpers')

const adminServices = {

  // (頁面) 顯示餐廳管理清單
  getRestaurants: (req, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => callback(null, { restaurants }))
      .catch(err => callback(err))
  }
}

module.exports = adminServices
