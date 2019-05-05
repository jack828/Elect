const generateVotes = require('../server/support/scripts/generate-votes')
const generateVotesSlow = require('../server/support/scripts/generate-votes-slow')

module.exports = (serviceLocator, app) => {
  app.get('/generate-votes', async (req, res) => {
    const start = new Date()
    res.send(start)
    await generateVotes(serviceLocator)
    const time = new Date() - start
    res.send(time)
    res.status(418)
    res.end()
  })

  app.get('/generate-votes-slow(/:count?)', async (req, res) => {
    const start = new Date()
    await generateVotesSlow(serviceLocator, req.params.count)
    const time = new Date() - start
    res.status(418).send(`${time / 1000} s`)
  })
}
