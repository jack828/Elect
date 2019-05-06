const { MongoClient } = require('mongodb')
const mongodbUri = require('mongodb-uri')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const persistenceFactory = require('./mongo-persistence-factory')

module.exports = serviceLocator => (config, done) => {
  const { database } = mongodbUri.parse(config)
  MongoClient.connect(
    config,
    {
      native_parser: true,
      useNewUrlParser: true
    },
    (error, client) => {
      if (error) return done(error)
      const db = client.db(database)
      serviceLocator.logger.info('Mongo Driver: Connected to', database)
      serviceLocator
        .register('serviceDatabase', db)
        .register('serviceDatabaseClient', client)
        .register('persistence', persistenceFactory(serviceLocator))
        .register(
          'sessionStore',
          new MongoStore({
            db: serviceLocator.serviceDatabase,
            clear_interval: 3600
          })
        )
      done()
    }
  )
}
