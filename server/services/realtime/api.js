const createRealtime = require('./realtime/controller')

const init = (serviceLocator, done) => {
  createRealtime(serviceLocator)
  done()
}

module.exports = () => ({ realtime: init })
