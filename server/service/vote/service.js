const { promisify } = require('util')
const crudService = require('crud-service')
const createSearch = require('cf-text-search')
const createSchema = require('./schema')

module.exports = (serviceLocator) => {
  const save = serviceLocator.persistence('vote')
  const schema = createSchema()
  const service = crudService('Vote', save, schema, {})

  const { partyService } = serviceLocator

  service.search = createSearch(service)

  service.findOne = save.findOne

  // TODO cache
  // TODO might need to be database specific aggregation
  service.getVotes = async (electionId) => {
    const rawVotes = await promisify(service.find)({ election: electionId })

    return rawVotes.reduce((votes, { party, constituencySlug }) => {
      if (!votes[constituencySlug]) {
        votes[constituencySlug] = {}
      }
      if (!votes[constituencySlug][party._id]) {
        votes[constituencySlug][party._id] = 0
      }
      votes[constituencySlug][party._id]++
      return votes
    }, {})
  }

  service.findVote = ({ user, election }) => new Promise(async (resolve, reject) => {
    let vote
    try {
      vote = await promisify(service.findOne)({
        election,
        user
      })
    } catch (error) {
      return reject(error)
    }

    let party
    try {
      party = await promisify(partyService.read)(vote.party)
    } catch (error) {
      return reject(error)
    }

    resolve({ ...vote, party })
  })

  service.cast = ({ user, electionId, partyId }) => new Promise(async (resolve, reject) => {
    try {
      const existingVote = await promisify(service.findOne)({
        election: electionId,
        user: user._id
      })
      if (existingVote) {
        return reject(new Error('Vote exists for user'))
      }
    } catch (error) {
      return reject(error)
    }

    let vote
    try {
      vote = await promisify(service.create)({
        election: electionId,
        user: user._id,
        party: partyId,
        constituencySlug: user.constituency
      })
    } catch (error) {
      return reject(error)
    }

    // TODO: broadcast anonymised vote
    // service.emit('vote', vote)

    return resolve(vote)
  })

  return service
}
