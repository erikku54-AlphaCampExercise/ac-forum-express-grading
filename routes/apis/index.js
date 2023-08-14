
const express = require('express')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controller')

// 引入子路由
const admin = require('./modules/admin')

// 管理介面路由
router.use('/admin', admin)

router.get('/restaurants', restController.getRestaurants) // (頁面)首頁-餐廳瀏覽

module.exports = router
