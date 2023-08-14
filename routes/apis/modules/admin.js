
const express = require('express')
const router = express.Router()

// const upload = require('../../../middleware/multer')

const adminController = require('../../../controllers/apis/admin-controller')
// const categoryController = require('../../../controllers/apis/category-controller')

router.get('/restaurants', adminController.getRestaurants) // (頁面)餐廳管理清單

module.exports = router
