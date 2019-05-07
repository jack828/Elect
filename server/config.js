const baseProperties = {
  passwordResetPolicy: {
    numDaysBetweenResets: 90
  },
  // TODO change when password resets are done
  adminHashType: 'bcrypt',
  adminMaxLoginAttempts: 10,
  salt: 'Retribution trainload senate.',
  osApiKey: '7ipy7Fe0nRjsWjIfB9YQAfGcZ0uNFifv',
  mapboxApiKey: 'pk.eyJ1IjoiamFjazgyOCIsImEiOiJjanM1enVzdWkwMGszNGFwaGMwN3JnMmVoIn0.r9CfYSdy4rdGFBHO-MJt7w',
  session: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secret: 'ZWxlY3Qgc2Vzc2lvbiBzZWNyZXQ'
  }
}

const envProperties = {
  development: {
    clientUrl: 'http://localhost:3000',
    url: 'localhost',
    port: 3003,
    database: 'mongo',
    databaseConfig: {
      mongo: 'mongodb://localhost:27017/elect-development',
      couchbase: {
        url: 'couchbase://localhost:11210',
        database: 'elect-development'
      }
    }
  },
  staging: {
    database: 'mongo',
    databaseConfig: {
      mongo: 'mongodb://localhost:27017/elect-staging'
    }
  },
  production: {
    clientUrl: 'http://localhost:3000',
    url: 'localhost',
    port: 3003,
    database: 'mongo',
    databaseConfig: {
      mongo: 'mongodb://localhost:27017/elect-development',
      couchbase: {
        url: 'couchbase://localhost:11210',
        database: 'elect-development'
      }
    }
  }
}

module.exports = env => ({
  ...baseProperties,
  ...envProperties[env]
})
