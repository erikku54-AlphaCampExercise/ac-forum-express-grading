
const adminServices = require('../../services/admin-services')

const adminController = {

  // (頁面) 顯示餐廳管理清單
  getRestaurants: (req, res, next) => {
    return adminServices.getRestaurants(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data }))
  },
  // (功能) 刪除餐廳
  deleteRestaurant: (req, res, next) => {
    return adminServices.deleteRestaurant(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data }))
  }

}

module.exports = adminController
