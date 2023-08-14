
module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back') // 導回錯誤發生的前一頁
    next(err)
  },
  apiErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      res.status(err.status || 500).json({ // 優先指定為error狀態碼，無設定則回傳500
        status: 'error',
        message: `${err.name}: ${err.message}`
      })
    } else {
      res.status(500).json({
        status: 'error',
        message: `${err}`
      })
    }
    next(err)
  }
}
