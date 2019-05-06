const couchbase = require('couchbase')
const persistenceFactory = require('./couchbase-persistence-factory')

module.exports = serviceLocator => async (config, done) => {
  const { url, database } = config

  const cluster = new couchbase.Cluster(url)

  cluster.authenticate('Administrator', '123456789')

  serviceLocator.logger.info('Couchbase Driver: Connected to', database)
  serviceLocator.register('serviceDatabase', cluster)
  serviceLocator.register('serviceDatabaseClient', cluster)
  serviceLocator.register('persistence', persistenceFactory(serviceLocator))
  done()
}
