const bcrypt = require('bcryptjs')

module.exports = (serviceLocator) => {
  const hash = (admin, cb) => {
    const toHash = admin.password + admin.passwordSalt + serviceLocator.config.salt
    bcrypt.hash(toHash, 10, cb)
  }

  const compare = (admin, password, cb) => {
    const toCompare = password + admin.passwordSalt + serviceLocator.config.salt
    bcrypt.compare(toCompare, admin.password, cb)
  }

  return {
    hash,
    compare
  }
}
