module.exports = (serviceLocator) => {
  const {
    wss,
    logger,
    metrics,
    voteService
  } = serviceLocator

  voteService.on('vote', (vote) => {
    const { _id, user, createdDate, ...anonymisedVote } = vote
    logger.debug('Broadcasting vote')
    metrics.increment('vote.broadcast')
    wss.broadcast('vote:cast', { vote: anonymisedVote })
  })

  wss.on('vote:load', async (id, data, client) => {
    const { electionId, key } = data
    const { user } = client.session

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
      logger.error('Vote cast error', error)
      return wss.emit(id, { error: 'Vote load error' })
    }

    wss.emit(id, { vote })
  })

  wss.on('vote:cast', async (id, data, client) => {
    const { electionId, partyId, key } = data
    const { user } = client.session

    if (!key || !user || user.key !== key) {
      return wss.emit(id, { error: 'Authentication error' })
    }

    metrics.increment('vote.cast')
    let vote
    try {
      const start = new Date()
      vote = await voteService.cast({ electionId, partyId, user })
      metrics.gauge('vote.cast.time', new Date() - start)
    } catch (error) {
      logger.error('Vote cast error', error)
      return wss.emit(id, { error: 'Vote cast error' })
    }

    wss.emit(id, { vote })
  })
}
