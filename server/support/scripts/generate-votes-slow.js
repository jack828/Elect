const promiseLimit = require('promise-limit')
const constituencies = require('../../../src/lib/constituency-slugs.json')
const createRandomParty = require('./random-party')

const limit = promiseLimit(50)

module.exports = async (serviceLocator, count = 10000) => {
  const {
    electionService,
    voteService
  } = serviceLocator
  const random = list => list[Math.floor(Math.random() * list.length)]
  const randomParty = await createRandomParty(serviceLocator)
  const [ election ] = await Promise.all([
    electionService.findActive()
  ])
  const votes = []

  for (let i = 0; i < count; i++) {
    votes.push({
      user: {
        _id: `${Math.random() * 1e6}`,
        constituency: random(constituencies).slug
      },
      electionId: election._id,
      partyId: randomParty()
    })
  }

  const start = new Date()
  serviceLocator.logger.info('Beginning vote insertMany')

  await Promise.all(votes.map(vote => limit(() => voteService.cast(vote))))

  const time = new Date() - start
  serviceLocator.logger.info('Finished vote insertMany', time)
}
