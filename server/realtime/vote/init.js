const createController = require('./controller')

const init = (serviceLocator, done) => {
  createController(serviceLocator)
  done()
}

module.exports = () => ({ voteRealtime: [ 'voteService', 'realtime', init ] })
