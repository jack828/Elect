const express = require('express')
const morgan = require('morgan')

const app = express()

module.exports = (serviceLocator) => {
  const inDevelopmentMode = serviceLocator.env === 'development'
  const logLevel = inDevelopmentMode ? 'dev' : 'combined'
  const logOptions = {
    stream: {
      write: data => serviceLocator.logger.info((`${data}`).trim())
    }
  }

  app.disable('x-powered-by')
    .use(morgan(logLevel, logOptions))

  return app
}
