const { promisify } = require('util')

module.exports = (serviceLocator) => {
  const { wss, voteService } = serviceLocator

  wss.on('vote:load', async (id, data, req) => {
    const { electionId, key } = data
    const { user } = req.session

    if (!key || !user || user.key !== key) {
      return wss.emit(id, { error: 'Authentication error' })
    }

    let vote
    try {
      vote = await voteService.findVote({
        election: electionId,
        user: user._id
      })
    } catch (error) {
      console.error(error)
      return wss.emit(id, { error: 'Vote load error' })
    }
    console.log('vote:load', vote)
    wss.emit(id, { vote })
  })

  wss.on('vote:cast', async (id, data, req) => {
    const { electionId, partyId, key } = data
    const { user } = req.session

    if (!key || !user || user.key !== key) {
      console.error('Authentication error')
      return wss.emit(id, { error: 'Authentication error' })
    }

    let vote
    try {
      vote = await voteService.cast({ electionId, partyId, user })
    } catch (error) {
      console.error(error)
      return wss.emit(id, { error: 'Vote error' })
    }
    wss.emit(id, { vote })
  })
}
