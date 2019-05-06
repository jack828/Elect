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
    try {
      await generateVotesSlow(serviceLocator, req.params.count)
    } catch (error) {
      console.error(error)
      console.error(error.errorProperty)
    }
    const time = new Date() - start
    res.status(418).json({
      votes: req.params.count,
      time: `${(time / 1000).toFixed(4)} s`,
      votesPerSec: `${(req.params.count / (time / 1000)).toFixed(4)} v/s`,
      secPerVote: `${((time / 1000) / req.params.count).toFixed(4)} s`
    })
  })
}
