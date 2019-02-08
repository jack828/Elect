const createApi = require('./api/controller')

const init = (serviceLocator, done) => {
  createApi(serviceLocator)
  done()
}

module.exports = () => ({ partyApi: [ 'partyService', init ] })
