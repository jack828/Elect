const createService = require('./service')

const init = (serviceLocator, done) => {
  serviceLocator.persistence.register('administrator')
  serviceLocator.acl.addResource('administrator', {
    actions: [ 'discover', 'create', 'read', 'update', 'delete', 'assignRoot', '*' ]
  })
  serviceLocator.register('administratorService', createService(serviceLocator))
  serviceLocator.register('authenticationProvider', serviceLocator.administratorService)
  done()
}

module.exports = () => ({ administratorService: [ 'database', 'acl', init ] })
