
const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false }) // 這種寫法未認證時只會回傳Unauthorized，無額外訊息

const authenticated = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user) => {
    // 401: 未知的使用者
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })

    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' }) // 403: 該使用者無權限
}

module.exports = { authenticated, authenticatedAdmin }
