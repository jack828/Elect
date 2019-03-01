const createService = require('./service')

const init = (serviceLocator, done) => {
  serviceLocator.persistence.register('party')
  serviceLocator.acl.addResource('party', {
    actions: [ 'discover', 'create', 'read', 'update', 'delete', '*' ]
  })
  serviceLocator.register('partyService', createService(serviceLocator))
  done()
}

module.exports = () => ({ partyService: [ 'database', 'acl', init ] })
