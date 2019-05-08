const crudService = require('crud-service')
const createSearch = require('cf-text-search')

const createSchema = require('./schema')
const createHasher = require('../administrator/lib/hasher')
const generateSalt = require('../administrator/lib/generate-salt')

module.exports = (serviceLocator) => {
  const save = serviceLocator.persistence('user')
  const schema = createSchema(save, serviceLocator.config)
  const service = crudService('User', save, schema, {})
  const hasher = createHasher(serviceLocator)

  const createHash = (user, callback) => {
    if (!user.password) {
      return callback(new Error('Password must not be empty'))
    }
    if (!user.passwordSalt) {
      return callback(new Error('Password salt must not be empty'))
    }
    if (!serviceLocator.config.salt) {
      return callback(new Error('Global salt must not be empty'))
    }

    hasher.hash(user, callback)
  }

  const passwordHasher = (user, callback) => {
    if (user) {
      if (user.password) {
        createHash(user, (err, hash) => {
          if (err) return callback(err)

          user.password = hash
          callback(null, user)
        })
      } else {
        callback(null, user)
      }
    }
  }

  const authenticate = (credentials, callback) => {
    if (credentials.identity) credentials.identity = credentials.identity.toLowerCase()
    save.findOne({ emailAddress: credentials.identity }, (err, user) => {
      if (err) {
        return callback(err, credentials)
      }
      if (!user) {
        return callback(new Error('Wrong Email and password combination.'), credentials)
      }
      if (!user.password) {
        return callback(new Error('No password for user. Reset required.'), credentials)
      }

      hasher.compare(user, credentials.password, (compareErr, valid) => {
        if (compareErr) {
          return callback(compareErr, credentials)
        }
        if (!valid) {
          return callback(new Error('Wrong Email and password combination.'), credentials)
        }

        user.key = generateSalt()
        user.keyExpiry = generateSalt()

        save.update({
          _id: user._id,
          key: user.key,
          keyExpiry: user.keyExpiry
        }, (updateErr) => {
          if (updateErr) {
            return callback(updateErr)
          }
          return callback(null, user)
        })
      })
    })
  }

  const emailLowerCaser = (user, callback) => {
    if (user && user.emailAddress) {
      user.emailAddress = user.emailAddress.toLowerCase()
    }
    callback(null, user)
  }

  service.pre('create', emailLowerCaser)
  service.pre('create', passwordHasher)
  service.pre('update', emailLowerCaser)
  service.pre('update', passwordHasher)
  service.pre('partialUpdate', emailLowerCaser)
  service.pre('partialUpdate', passwordHasher)

  service.authenticate = authenticate
  service.createHash = createHash

  service.search = createSearch(service)

  service.findOne = save.findOne

  return service
}
