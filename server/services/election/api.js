const createApi = require('./api/controller')

const init = (serviceLocator, done) => {
  createApi(serviceLocator)
  done()
}

module.exports = () => ({ electionApi: [ 'electionService', init ] })
