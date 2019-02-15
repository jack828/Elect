module.exports = (serviceLocator) => {
  const { wss, electionService } = serviceLocator

  wss.on('dashboard:load', async (id) => {
    // TODO get current vote status of logged in user
    const election = await electionService.findActive()

    if (id) {
      wss.emit(id, { election })
    }
  })
}
