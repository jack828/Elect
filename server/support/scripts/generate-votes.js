const { promisify } = require('util')
const constituencies = require('../../../src/lib/constituency-slugs.json')

module.exports = async (serviceLocator) => {
  const {
    serviceDatabase,
    electionService,
    partyService
  } = serviceLocator
  const voteCollection = serviceDatabase.collection('vote')
  const random = list => list[Math.floor(Math.random() * list.length)]
  const [ , election, parties ] = await Promise.all([
    voteCollection.remove({}),
    electionService.findActive(),
    promisify(partyService.find)({ enabled: true })
  ])
  const votes = []

  for (let i = 0; i < 100000; i++) {
    votes.push({
      election: election._id,
      user: `${Math.random() * 1e6}`,
      constituencySlug: random(constituencies).slug,
      // TODO a curve or something
      party: random(parties),
      createdDate: new Date()
    })
  }
  await Promise.all(votes.map(vote => voteCollection.insertOne(vote)))
}
