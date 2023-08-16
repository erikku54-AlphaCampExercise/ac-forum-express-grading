
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')

const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// set up Passport Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        // 此處如果req.flash不拿掉，當前端呼叫API，if成立時系統會crash，因為沒有session，flash找不到地方存
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        // if (!user) {
        //   return req.originalUrl.includes('/api/')
        //     ? cb(null, false, { message: 'Not registered Email!' })
        //     : cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        // }

        bcrypt.compare(password, user.password)
          .then(res => {
            // 此處如果req.flash不拿掉，當前端呼叫API，if成立時系統會crash，因為沒有session，flash找不到地方存
            if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            // if (!res) {
            //   return req.originalUrl.includes('/api/')
            //     ? cb(null, false, { message: '帳號或密碼輸入錯誤!' })
            //     : cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            // }
            return cb(null, user)
          })
      })
      .catch(err => cb(err, false))
  }
))

const jwtOptions = {
  // jwtFromRequest: 指定要去哪找token，此處指定authorization header裡的bearer
  // secretOrKey: 指定密鑰
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JWTStrategy(jwtOptions, (jwtPayload, cb) => {
  // 以下定義驗證並解開token後要進行的動作
  User.findByPk(jwtPayload.id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user)) // 把user向後傳遞給passport.authenticate()
    .catch(err => cb(err))
}))

// serialize & deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  return User.findByPk(id, {
    // 也可以用include: { all: true, nested: true }
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  })
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
