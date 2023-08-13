
const express = require('express')
const router = express.Router()

const restController = require('../../controllers/apis/restaurant-controller')

router.get('/restaurants', restController.getRestaurants) // (頁面)首頁-餐廳瀏覽

// router.get('/restaurants', authenticated, (req, res, next) => { console.log('test'); next() }) // (頁面)首頁-餐廳瀏覽

module.exports = router
