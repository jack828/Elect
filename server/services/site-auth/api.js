const createController = require('./realtime/controller')

const init = (serviceLocator, done) => {
  createController(serviceLocator)
  done()
}

module.exports = () => ({ siteAuthRealtime: [ 'userService', init ] })
