const { promisify } = require('util')
const crudService = require('crud-service')
const createSearch = require('cf-text-search')
const createSchema = require('./schema')

module.exports = (serviceLocator) => {
  const save = serviceLocator.persistence('election')
  const schema = createSchema()
  const service = crudService('Election', save, schema, {})
  service.search = createSearch(service)

  const embellish = async (election) => {
    const [
      parties,
      votes
    ] = await Promise.all([
      promisify(serviceLocator.partyService.find)({
        _id: { $in: election.parties }
      }),
      serviceLocator.voteService.getVotes(election._id)
    ])

    return ({
      ...election,
      parties,
      votes
    })
  }

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

    const embellishedElection = await embellish(election)
    resolve(embellishedElection)
  })

  return service
}
