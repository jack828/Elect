const { promisify } = require('util')
const promiseLimit = require('promise-limit')
const constituencies = require('../../../src/lib/constituency-slugs.json')

const limit = promiseLimit(50)

module.exports = async (serviceLocator) => {
  const {
    electionService,
    partyService,
    voteService
  } = serviceLocator
  const random = list => list[Math.floor(Math.random() * list.length)]
  const [ election, parties ] = await Promise.all([
    electionService.findActive(),
    promisify(partyService.find)({ enabled: true })
  ])
  const votes = []

  for (let i = 0; i < 10000; i++) {
    const party = random([ null, ...parties ])
    votes.push({
      user: {
        _id: `${Math.random() * 1e6}`,
        constituency: random(constituencies).slug
      },
      electionId: election._id,
      // TODO a curve or something
      partyId: party ? party._id : party
    })
  }
  await Promise.all(votes.map(vote => limit(() => voteService.cast(vote))))
}
