const serviceLocator = require('service-locator')()
const bunyan = require('bunyan')
const noopLogger = require('mc-logger')
const UberCache = require('uber-cache')

const createConfig = require('./config')
const bootstrap = require('./bootstrap')

const env = process.env.NODE_ENV || 'development'
const inDevelopmentMode = env === 'development'
// Only have debug logging on development
const logLevel = process.env.LOG_LEVEL || (inDevelopmentMode ? 'debug' : 'info')

const logger = process.env.DISABLE_LOGGING
  ? noopLogger
  : bunyan.createLogger({
    name: 'site',
    streams: [ {
      stream: process.stdout,
      level: logLevel
    } ]
  })

serviceLocator
  .register('env', env)
  .register('cache', new UberCache())
  .register('config', createConfig(env))
  .register('logger', logger)

const port = process.env.PORT || serviceLocator.config.port

bootstrap(serviceLocator, (error) => {
  if (error) throw error

  serviceLocator.server.emit('preBoot')

  serviceLocator.server.on('requestError', (err, req) => {
    serviceLocator.logger.error('Request Error', err.stack, req.url)
  })

  serviceLocator.httpServer.listen(port, () => {
    serviceLocator.server.emit('listening')
    serviceLocator.logger.info(`Listening on http://${serviceLocator.config.url}:${port}`)
  })
})
