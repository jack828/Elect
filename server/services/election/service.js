const crudService = require('crud-service')
const createSearch = require('cf-text-search')
const createSchema = require('./schema')

module.exports = (serviceLocator) => {
  const save = serviceLocator.persistence('election')
  const schema = createSchema()
  const service = crudService('Election', save, schema, {})

  service.search = createSearch(service)

  return service
}
