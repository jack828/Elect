const createService = require('./service')

const init = (serviceLocator, done) => {
  serviceLocator.persistence.register('vote')
  serviceLocator.acl.addResource('vote', {
    actions: [ 'discover', 'create', 'read', 'update', 'delete', '*' ]
  })
  serviceLocator.register('voteService', createService(serviceLocator))
  done()
}

module.exports = () => ({
  voteService: [ 'database', 'acl', 'partyService', init ]
})
