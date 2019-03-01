const createService = require('./service')

const init = (serviceLocator, done) => {
  serviceLocator.persistence.register('user')
  serviceLocator.register('userService', createService(serviceLocator))
  done()
}

module.exports = () => ({ userService: [ 'database', 'acl', init ] })
