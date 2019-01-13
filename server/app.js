const serviceLocator = require('service-locator')()
const bunyan = require('bunyan')

const createConfig = require('./config')
const bootstrap = require('./bootstrap')

const env = process.env.NODE_ENV || 'development'
const inDevelopmentMode = env === 'development'
// Only have debug logging on development
const logLevel = process.env.LOG_LEVEL || (inDevelopmentMode ? 'debug' : 'info')

serviceLocator
  .register('env', env)
  .register('config', createConfig(env))
  .register('logger', bunyan.createLogger({
    name: 'site',
    streams: [ {
      stream: process.stdout,
      level: logLevel
    } ]
  }))

const port = process.env.PORT || serviceLocator.config.port

bootstrap(serviceLocator, (error) => {
  if (error) throw error

  serviceLocator.server.emit('preBoot')

  serviceLocator.server.on('started', (httpServer) => {
    serviceLocator.register('httpServer', httpServer)
    serviceLocator.logger.info(`Server running: ${serviceLocator.config.url}`)
  })

  serviceLocator.server.on('requestError', (err, req) => {
    serviceLocator.logger.error('Request Error', err.stack, req.url)
  })

  serviceLocator.server.listen(port, () => {
    serviceLocator.logger.info(`Listening on http://${serviceLocator.config.url}:${serviceLocator.config.port}`)
  })
})
