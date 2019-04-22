const generateVotes = require('../server/support/scripts/generate-votes')
const generateVotesSlow = require('../server/support/scripts/generate-votes-slow')

module.exports = (serviceLocator, app) => {
  app.get('/generate-votes', async (req, res) => {
    await generateVotes(serviceLocator)
    res.sendStatus(418)
  })

  app.get('/generate-votes-slow', async (req, res) => {
    await generateVotesSlow(serviceLocator)
    res.sendStatus(418)
  })
}
