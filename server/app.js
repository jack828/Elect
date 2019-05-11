const serviceLocator = require('service-locator')()
const bunyan = require('bunyan')
const datadog = require('datadog-metrics')
const noopLogger = require('mc-logger')
const UberCache = require('uber-cache')

const createConfig = require('./config')
const bootstrap = require('./bootstrap')

const env = process.env.NODE_ENV || 'development'
const inDevelopmentMode = env === 'development'
// Only have debug logging on development
const logLevel = process.env.LOG_LEVEL || (inDevelopmentMode ? 'debug' : 'info')
const noopMetrics = {
  increment() {},
  guage() {},
  histogram() {}
}

const logger = process.env.DISABLE_LOGGING
  ? noopLogger
  : bunyan.createLogger({
    name: 'site',
    streams: [ {
      stream: process.stdout,
      level: logLevel
    } ]
  })
const metrics = !inDevelopmentMode
  ? datadog
  : noopMetrics

metrics.init({ prefix: 'elect.' })

serviceLocator
  .register('env', env)
  .register('cache', new UberCache())
  .register('config', createConfig(env))
  .register('logger', logger)
  .register('metrics', metrics)

const port = process.env.PORT || serviceLocator.config.port

bootstrap(serviceLocator, (error) => {
  if (error) throw error

  serviceLocator.server.emit('preBoot')

  serviceLocator.server.on('requestError', (err, req) => {
    serviceLocator.logger.error('Request Error', err.stack, req.url)
  })

  serviceLocator.httpServer.listen(port, serviceLocator.config.backlogLimit, () => {
    serviceLocator.server.emit('listening')
    serviceLocator.logger.info(`Listening on http://${serviceLocator.config.url}:${port}`)
  })
})
