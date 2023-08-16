
const jwt = require('jsonwebtoken')

const userServices = require('../../services/user-service')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      // 簽發JWT，效期30天
      // jwt.sign()不是非同步事件，不回傳promise，用try...catch進行錯誤處理
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({
        status: 'success',
        data: { token, user: userData }
      })
    } catch (err) {
      return next(err)
    }
  },
  signUp: (req, res, next) => {
    return userServices.signUp(req, (err, data) =>
      err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = userController
