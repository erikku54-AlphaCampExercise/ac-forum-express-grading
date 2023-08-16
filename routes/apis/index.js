
const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')

// 引入子路由
const admin = require('./modules/admin')

// 管理介面路由
router.use('/admin', authenticated, authenticatedAdmin, admin)

// sign up & sign in相關
router.post('/signup', userController.signUp) // (功能)註冊
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// restaurant瀏覽相關
router.get('/restaurants', authenticated, restController.getRestaurants) // (頁面)首頁-餐廳瀏覽

router.use('/', apiErrorHandler)

module.exports = router
