
const express = require('express')
const router = express.Router()

// const upload = require('../../../middleware/multer')
const { apiErrorHandler } = require('../../../middleware/error-handler')

const adminController = require('../../../controllers/apis/admin-controller')
// const categoryController = require('../../../controllers/apis/category-controller')

router.delete('/restaurants/:id', adminController.deleteRestaurant) // (功能)刪除餐廳
router.get('/restaurants', adminController.getRestaurants) // (頁面)餐廳管理清單

router.use('/', apiErrorHandler)

module.exports = router
