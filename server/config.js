const baseProperties = {
  passwordResetPolicy: {
    numDaysBetweenResets: 90
  },
  // TODO change when password resets are done
  adminHashType: 'bcrypt',
  adminMaxLoginAttempts: 10,
  salt: 'Retribution trainload senate.'
}

const envProperties = {
  development: {
    url: 'localhost',
    port: 3003,
    databaseUrl: 'mongodb://localhost:27017/elect-development'
  },
  staging: {
    databaseUrl: 'mongodb://localhost:27017/elect-staging'
  },
  production: {
    databaseUrl: 'mongodb://localhost:27017/elect-production'
  }
}

module.exports = env => ({
  ...baseProperties,
  ...envProperties[env]
})
