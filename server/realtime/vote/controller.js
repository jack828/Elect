module.exports = (serviceLocator) => {
  const { wss, voteService } = serviceLocator

  wss.on('vote:load', async (id) => {
    // TODO
    wss.emit(id, { })
  })

  wss.on('vote:cast', async (id, data, req) => {
    const { electionId, partyId, key } = data
    const { user } = req.session

    if (!key || !user || user.key !== key) {
      return wss.emit(id, { error: 'Authentication error' })
    }

    let vote
    try {
      vote = await voteService.cast({ electionId, partyId, user })
    } catch (error) {
      return wss.emit(id, { error: 'Vote error' })
    }
    wss.emit(id, { vote })
  })
}
