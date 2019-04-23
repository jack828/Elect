const constituencies = require('../../../src/lib/constituency-slugs.json')
const createRandomParty = require('./random-party')

module.exports = async (serviceLocator) => {
  const {
    serviceDatabase,
    electionService
  } = serviceLocator
  const voteCollection = serviceDatabase.collection('vote')
  const random = list => list[Math.floor(Math.random() * list.length)]
  const randomParty = await createRandomParty(serviceLocator)
  const [ , election ] = await Promise.all([
    voteCollection.remove({}),
    electionService.findActive()
  ])
  const votes = []

  serviceLocator.logger.info('Beginning vote generation')
  for (let i = 0; i < 100000; i++) {
    votes.push({
      election: election._id,
      user: `${Math.random() * 1e6}`,
      constituencySlug: random(constituencies).slug,
      // TODO a curve or something
      party: randomParty(),
      createdDate: new Date()
    })
  }
  serviceLocator.logger.info('Finished vote generation')

  serviceLocator.logger.info('Beginning vote insertMany')
  await voteCollection.insertMany(votes)
  serviceLocator.logger.info('Finished vote insertMany')
}
