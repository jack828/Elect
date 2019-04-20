const express = require('express')
const morgan = require('morgan')
const { createServer } = require('http')
const { join } = require('path')
const generateVotes = require('../server/support/scripts/generate-votes')

const app = express()
const server = createServer(app)

module.exports = (serviceLocator) => {
  const { env, logger } = serviceLocator
  const inDevelopmentMode = env === 'development'
  const logLevel = inDevelopmentMode ? 'dev' : 'combined'
  const logOptions = {
    stream: {
      write: data => logger.info((`${data}`).trim())
    }
  }

  app.disable('x-powered-by')
    .use(morgan(logLevel, logOptions))

  if (inDevelopmentMode) {
    app.get('/generate-votes', async (req, res) => {
      await generateVotes(serviceLocator)
      res.sendStatus(418)
    })
  }

  if (!inDevelopmentMode) {
    app.use(express.static(join(__dirname, '../build')))

    app.get('/', (req, res) => {
      res.sendFile(join(__dirname, '../build', 'index.html'))
    })
  }
  serviceLocator.register('httpServer', server)


  return app
}
