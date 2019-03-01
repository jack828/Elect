const createApi = require('./controller')

const init = (serviceLocator, done) => {
  createApi(serviceLocator)
  done()
}

module.exports = () => ({ partyApi: [ 'partyService', init ] })
