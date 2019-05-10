const createMongoDriver = require('./drivers/mongo')
const createCouchbaseDriver = require('./drivers/couchbase')

const init = (serviceLocator, done) => {
  const drivers = {
    mongo: createMongoDriver(serviceLocator),
    couchbase: createCouchbaseDriver(serviceLocator)
  }

  const { database, databaseConfig } = serviceLocator.config

  if (database === undefined) {
    done(new Error('You must provide a database selection in config.database'))
  }
  if (databaseConfig === undefined || databaseConfig[database] === undefined) {
    done(new Error('You must provide database config in config.databaseConfig for database:', database))
  }
  if (drivers[database] === undefined) {
    done(new Error('Unsupported database:', database))
  }

  const initialiseDriver = drivers[database]
  const databaseUrl = databaseConfig[database]

  initialiseDriver(databaseUrl, (error) => {
    if (error) {
      serviceLocator.logger.error(error, error.message, error.stack)
      return done(error)
    }
    serviceLocator.logger.info(`Initialised database "${database}"`)
    done()
  })
}

module.exports = () => ({ database: init })
