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

  const embellish = async (vote) => {
    let party
    if (!vote.party) {
      party = { name: 'Spoilt Ballot' }
    } else {
      party = await promisify(partyService.read)(vote.party)
    }
    return ({
      ...vote,
      party
    })
  }

  // TODO cache
  // TODO might need to be database specific aggregation
  service.getVotes = async (electionId) => {
    const rawVotes = await promisify(service.find)({ election: electionId })

    // This is unsorted data
    return rawVotes.reduce((votes, { party, constituencySlug }) => {
      if (!votes[constituencySlug]) {
        votes[constituencySlug] = {}
      }

      const partyId = party ? party._id : null

      if (!votes[constituencySlug][partyId]) {
        votes[constituencySlug][partyId] = 0
      }
      votes[constituencySlug][partyId]++
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
    console.log(vote)
    if (!vote) return resolve(null)

    resolve(await embellish(vote))
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

    return resolve(await embellish(vote))
  })

  return service
}
