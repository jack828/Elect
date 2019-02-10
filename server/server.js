const express = require('express')
const morgan = require('morgan')
const { join } = require('path')

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

  if (!inDevelopmentMode) {
    app.use(express.static(join(__dirname, '../build')))

    app.get('/', (req, res) => {
      res.sendFile(join(__dirname, '../build', 'index.html'))
    })
  }
  return app
}
