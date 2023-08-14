
const { Restaurant, User, Category } = require('../models')

const { imgurFileHandler } = require('../helpers/file-helpers')

const adminServices = {

  // (頁面) 顯示餐廳管理清單
  getRestaurants: (req, callback) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => callback(null, { restaurants }))
      .catch(err => callback(err))
  },
  // (功能) 新增餐廳
  postRestaurant: (req, callback) => {
    const { name, categoryId, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req
    return imgurFileHandler(file) // 把取出的檔案傳給 file-helper 處理
      .then(filePath => Restaurant.create({
        name,
        categoryId,
        tel,
        address,
        openingHours,
        description,
        image: filePath || undefined // 將檔案路徑存在image中
      }))
      .then(newRestaurant => callback(null, { restaurant: newRestaurant }))
      .catch(err => callback(err))
  },
  // (功能) 刪除餐廳
  deleteRestaurant: (req, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(deletedRestaurant => callback(null, { restaurant: deletedRestaurant }))
      .catch(err => callback(err))
  }
}

module.exports = adminServices
