const createRealtime = require('./realtime/controller')

const init = (serviceLocator, done) => {
  serviceLocator.server.on('listening', () => {
    createRealtime(serviceLocator)
  })
  done()
}

module.exports = () => ({ realtime: [ 'database', init ] })
