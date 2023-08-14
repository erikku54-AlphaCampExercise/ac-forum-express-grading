
const adminServices = require('../../services/admin-services')

const adminController = {

  // (頁面) 顯示餐廳管理清單
  getRestaurants: (req, res, next) => {
    return adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json(data))
  }

}

module.exports = adminController
