const crypto = require('crypto')

module.exports = (serviceLocator) => {
  const hash = (admin, cb) => {
    const shaSum = crypto.createHash('sha1').update(admin.password + admin.passwordSalt + serviceLocator.config.salt)
    const hashValue = shaSum.digest('hex')
    cb(null, hashValue)
  }

  const compare = (admin, password, cb) => {
    hash({ ...admin, password }, (error, hashedPassword) => {
      if (error) return cb(error)
      cb(null, hashedPassword === admin.password)
    })
  }

  return {
    hash,
    compare
  }
}
