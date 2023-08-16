
const bcrypt = require('bcryptjs')

const db = require('../models')
const { User, Comment, Restaurant, Favorite, Like, Followship } = db

// const { imgurFileHandler } = require('../../helpers/file-helpers')

const userServices = {

  signUp: (req, callback) => {
    if (req.body.password !== req.body.passwordCheck) return callback(new Error('Passwords do not match!'))

    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) return callback(new Error('Email already exists!'))
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(createdRestaurant => callback(null, { restaurant: createdRestaurant }))
      .catch(err => callback(err))
  }

}

module.exports = userServices
