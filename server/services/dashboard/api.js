const createController = require('./realtime/controller')

const init = (serviceLocator, done) => {
  createController(serviceLocator)
  done()
}

module.exports = () => ({ electionRealtime: [ 'electionService', init ] })
