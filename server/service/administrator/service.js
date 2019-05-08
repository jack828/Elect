const crudService = require('crud-service')
const createSearch = require('cf-text-search')

const createSchema = require('./schema')
const createHasher = require('./lib/hasher')
const createBruteForcePreventer = require('./lib/brute-force-preventer')

module.exports = (serviceLocator) => {
  const save = serviceLocator.persistence('administrator')
  const schema = createSchema(save, serviceLocator.config)
  const service = crudService('Administrator', save, schema, {})
  const hasher = createHasher(serviceLocator)
  const bruteForcePreventer = createBruteForcePreventer(serviceLocator)

  const createHash = (administrator, callback) => {
    if (!administrator.password) {
      return callback(new Error('Password must not be empty'))
    }
    if (!administrator.passwordSalt) {
      return callback(new Error('Password salt must not be empty'))
    }
    if (!serviceLocator.config.salt) {
      return callback(new Error('Global salt must not be empty'))
    }

    hasher.hash(administrator, callback)
  }

  const passwordHasher = (administrator, callback) => {
    if (administrator) {
      if (administrator.password) {
        createHash(administrator, (err, hash) => {
          if (err) return callback(err)

          administrator.password = hash
          callback(null, administrator)
        })
      } else {
        callback(null, administrator)
      }
    }
  }

  const lookupKey = (id, cb) => {
    save.find({ _id: id },
      {},
      (err, administrators) => {
        if (err) {
          return cb(err)
        }

        if (administrators.length > 1) {
          return cb(new Error('Multiple key match. This is a potential security risk.'))
        }

        if ((administrators[0]) && (administrators[0].key)) {
          return cb(null, administrators[0].key)
        }
        return cb(null, undefined)
      })
  }

  const authenticate = (credentials, callback) => {
    if (credentials.identity) credentials.identity = credentials.identity.toLowerCase()
    save.findOne({ emailAddress: credentials.identity }, (err, administrator) => {
      if (err) {
        return callback(err, credentials)
      }
      if (!administrator) {
        return callback(new Error('Wrong Email and password combination.'), credentials)
      }
      if (!administrator.password) {
        return callback(new Error('No password for user. Reset required.'), credentials)
      }

      bruteForcePreventer.check(administrator, (error) => {
        if (error) return callback(error)
        hasher.compare(administrator, credentials.password, (compareErr, valid) => {
          if (compareErr) {
            return callback(compareErr, credentials)
          }
          if (!valid) {
            return bruteForcePreventer.incrementFailedAttemptCount(administrator, (attErr) => {
              if (attErr) return callback(attErr)
              return callback(new Error('Wrong Email and password combination.'), credentials)
            })
          }

          bruteForcePreventer.resetFailedAttemptCount(administrator, (cErr) => {
            if (cErr) return callback(cErr)
            // Every time a user authenticate create a session key.
            // Rather a nasty hack to reuse salt generator.
            // Really schema should have the function tacked on.
            administrator.key = schema.getProperties().passwordSalt.defaultValue()
            save.update(administrator, callback)
          })
        })
      })
    })
  }

  const emailLowerCaser = (administrator, callback) => {
    if (administrator && administrator.emailAddress) {
      administrator.emailAddress = administrator.emailAddress.toLowerCase()
    }
    callback(null, administrator)
  }

  service.pre('create', emailLowerCaser)
  service.pre('create', passwordHasher)
  service.pre('update', emailLowerCaser)
  service.pre('update', passwordHasher)
  service.pre('partialUpdate', emailLowerCaser)
  service.pre('partialUpdate', passwordHasher)

  service.lookupKey = lookupKey
  service.authenticate = authenticate
  service.createHash = createHash

  service.search = createSearch(service)

  return service
}
