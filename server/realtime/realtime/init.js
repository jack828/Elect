const createRealtime = require('./controller')

const init = (serviceLocator, done) => {
  createRealtime(serviceLocator)
  done()
}

module.exports = () => ({ realtime: [ 'database', 'session', init ] })
