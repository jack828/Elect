const createMongo = require('./drivers/mongo')
const createCouchbase = require('./drivers/couchbase')

const init = (serviceLocator, done) => {
  const drivers = {
    mongo: createMongo(serviceLocator),
    couchbase: createCouchbase(serviceLocator)
  }

  const { databaseConfig } = serviceLocator.config
  const database = process.env.DATABASE_OVERRIDE || serviceLocator.config.database

  if (database === undefined) {
    done(new Error('You must provide a database selection in config.database or process.env.DATABASE_OVERRIDE'))
  }
  if (databaseConfig === undefined || databaseConfig[database] === undefined) {
    done(new Error('You must provide database config in config.databaseConfig for database:', database))
  }
  if (drivers[database] === undefined) {
    done(new Error('Unsupported database:', database))
  }

  const driver = drivers[database]
  const databaseUrl = databaseConfig[database]

  driver(databaseUrl, (error) => {
    if (error) {
      serviceLocator.logger.error(error.message, error.stack)
      return done(error)
    }
    serviceLocator.logger.info(`Initialised database "${database}"`)
    done()
  })
}

module.exports = () => ({ database: init })
