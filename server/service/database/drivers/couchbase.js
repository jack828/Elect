const couchbase = require('couchbase')
const persistenceFactory = require('./couchbase-persistence-factory')

module.exports = serviceLocator => async (uri, done) => {
  const cluster = new couchbase.Cluster(uri)

  cluster.authenticate('Administrator', '123456789')

  serviceLocator.logger.info('Couchbase Driver: Connected to', uri)
  serviceLocator.register('serviceDatabase', cluster)
  serviceLocator.register('serviceDatabaseClient', cluster)
  serviceLocator.register('persistence', persistenceFactory(serviceLocator))
  done()
}
