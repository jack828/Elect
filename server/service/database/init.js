const { MongoClient } = require('mongodb')
const mongodbUri = require('mongodb-uri')
const persistenceFactory = require('./persistence-factory')

const init = (serviceLocator, done) => {
  const connectionUri = process.env.MONGO_URL || serviceLocator.config.databaseUrl
  if (connectionUri === undefined) {
    done(new Error('You must provide a database URL in config.databaseUrl or in the environment variable MONGO_URL'))
  }
  const { database } = mongodbUri.parse(connectionUri)
  MongoClient.connect(
    connectionUri,
    {
      native_parser: true,
      useNewUrlParser: true
    },
    (err, client) => {
      if (err) {
        serviceLocator.logger.error(err.message, err.stack)
        return done(err)
      }
      const db = client.db(database)
      serviceLocator.logger.info('Connected to', database)
      serviceLocator.register('serviceDatabase', db)
      serviceLocator.register('serviceDatabaseClient', client)
      serviceLocator.register('persistence', persistenceFactory(serviceLocator))
      done()
    }
  )
}

module.exports = () => ({ database: init })
