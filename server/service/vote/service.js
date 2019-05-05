const { promisify } = require('util')
const crudService = require('crud-service')
const createSearch = require('cf-text-search')
const memoize = require('uber-memoize')
const createSchema = require('./schema')

module.exports = (serviceLocator) => {
  const {
    persistence,
    cache,
    electionService,
    partyService
  } = serviceLocator
  const save = persistence('vote')
  const schema = createSchema()
  const service = crudService('Vote', save, schema, {})

  const readElection = memoize(
    'readElection',
    cache
  )(
    electionService.read,
    60 * 60 * 1000 // 1 hour
  )

  const findParty = memoize(
    'findParty',
    cache
  )(
    partyService.find,
    60 * 60 * 1000 // 1 hour
  )

  const readParty = memoize(
    'readParty',
    cache
  )(
    partyService.read,
    60 * 60 * 1000 // 1 hour
  )

  const embellish = async (vote) => {
    let party
    if (!vote.party) {
      party = { name: 'Spoilt Ballot' }
    } else {
      party = await promisify(readParty)(vote.party)
    }
    return ({
      ...vote,
      party
    })
  }

  service.search = createSearch(service)

  service.findOne = save.findOne

  // TODO might need to be database specific aggregation
  service.getVotes = async (electionId) => {
    const [ rawVotes, election ] = await Promise.all([
      await promisify(service.find)({ election: electionId }),
      await promisify(readElection)(electionId)
    ])
    const parties = await promisify(findParty)({
      _id: {
        $in: election.parties
      }
    })
    const initialTotals = parties.reduce((totals, party) => ({
      ...totals,
      [party._id]: 0
    }), { null: 0 })

    // This is unsorted data
    return rawVotes.reduce((votes, { party, constituencySlug }) => {
      if (!votes[constituencySlug]) {
        votes[constituencySlug] = { ...initialTotals }
      }

      const foundParty = parties.find(({ _id }) => party === _id)

      const partyId = foundParty ? foundParty._id : party

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

    service.emit('vote', vote)

    // TODO avoid superfluous reads on every vote!
    return resolve(await embellish(vote))
  })

  return service
}
