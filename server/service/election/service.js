const { promisify } = require('util')
const crudService = require('crud-service')
const createSearch = require('cf-text-search')
const createSchema = require('./schema')

module.exports = (serviceLocator) => {
  const save = serviceLocator.persistence('election')
  const schema = createSchema()
  const service = crudService('Election', save, schema, {})

  service.search = createSearch(service)

  service.findActive = () => new Promise(async (resolve, reject) => {
    const now = new Date()
    let election
    try {
      election = await promisify(save.findOne)({
        visibleFrom: { $lte: now },
        visibleTo: { $gte: now }
      })
    } catch (error) {
      return reject(error)
    }

    const parties = await promisify(serviceLocator.partyService.find)({
      _id: { $in: election.parties },
      enabled: true
    })
    resolve({ ...election, parties })
  })

  return service
}
