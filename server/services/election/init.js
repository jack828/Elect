const createService = require('./service')

const init = (serviceLocator, done) => {
  serviceLocator.persistence.register('election')
  serviceLocator.acl.addResource('election', {
    actions: [ 'discover', 'create', 'read', 'update', 'delete', '*' ]
  })
  serviceLocator.register('electionService', createService(serviceLocator))
  done()
}

module.exports = () => ({ electionService: [ 'database', 'acl', init ] })
