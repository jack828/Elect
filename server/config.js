const baseProperties = {
  passwordResetPolicy: {
    numDaysBetweenResets: 90
  },
  // TODO change when password resets are done
  adminHashType: 'bcrypt',
  adminMaxLoginAttempts: 10,
  salt: 'Retribution trainload senate.',
  osApiKey: '7ipy7Fe0nRjsWjIfB9YQAfGcZ0uNFifv'
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
    url: 'https://elect-project.herokuapp.com',
    databaseUrl: 'mongodb://elect-production:qg4w*660B9Mg96!R@ds129625.mlab.com:29625/elect-production'
  }
}

module.exports = env => ({
  ...baseProperties,
  ...envProperties[env]
})
