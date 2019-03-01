const bcryptHasher = require('./hashers/bcrypt')
const sha1Hasher = require('./hashers/sha1')

module.exports = (serviceLocator) => {
  const hashers = { sha1: sha1Hasher(serviceLocator), bcrypt: bcryptHasher(serviceLocator) }

  const getHasher = () => {
    let hashType = serviceLocator.config.adminHashType
    if (!hashType) hashType = 'bcrypt'
    return hashers[hashType]
  }

  const hash = (admin, cb) => {
    const hasher = getHasher()
    hasher.hash(admin, cb)
  }

  const compare = (admin, password, cb) => {
    const hasher = getHasher()
    hasher.compare(admin, password, cb)
  }

  return {
    hash,
    compare
  }
}
