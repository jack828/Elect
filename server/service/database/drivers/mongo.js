const { MongoClient } = require('mongodb')
const mongodbUri = require('mongodb-uri')
const persistenceFactory = require('./mongo-persistence-factory')

module.exports = serviceLocator => (databaseUri, done) => {
  const { database } = mongodbUri.parse(databaseUri)
  MongoClient.connect(
    databaseUri,
    {
      native_parser: true,
      useNewUrlParser: true
    },
    (error, client) => {
      if (error) return done(error)
      const db = client.db(database)
      serviceLocator.logger.info('Mongo Driver: Connected to', database)
      serviceLocator.register('serviceDatabase', db)
      serviceLocator.register('serviceDatabaseClient', client)
      serviceLocator.register('persistence', persistenceFactory(serviceLocator))
      done()
    }
  )
}
