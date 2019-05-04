const createMongo = require('./drivers/mongo')

const init = (serviceLocator, done) => {
  const drivers = {
    mongo: createMongo(serviceLocator)
  }

  const { database, databaseUrls } = serviceLocator.config

  if (database === undefined) {
    done(new Error('You must provide a database selection in config.database'))
  }
  if (databaseUrls === undefined || databaseUrls[database] === undefined) {
    done(new Error('You must provide a database url in config.databaseUrls for database:', database))
  }
  if (drivers[database] === undefined) {
    done(new Error('Unsupported database:', database))
  }

  const driver = drivers[database]
  const databaseUrl = databaseUrls[database]

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
