// For docker
const {
  CLIENT_URL,
  URL,
  PORT,
  DATABASE,
  MONGO_URI,
  COUCHBASE_URI
} = process.env

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
      mongo: 'mongodb://localhost:27017/elect',
      couchbase: {
        url: 'couchbase://localhost:11210',
        database: 'elect'
      }
    }
  },
  production: {
    clientUrl: CLIENT_URL || 'http://localhost:3003',
    url: URL || 'localhost',
    port: PORT || 3003,
    database: DATABASE || 'mongo',
    databaseConfig: {
      mongo: MONGO_URI || 'mongodb://192.168.0.42:27017/elect',
      couchbase: COUCHBASE_URI || 'couchbase://localhost:11210'
    }
  }
}

module.exports = env => ({
  ...baseProperties,
  ...envProperties[env]
})
