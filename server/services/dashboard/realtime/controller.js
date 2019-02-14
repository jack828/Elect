module.exports = (serviceLocator) => {
  const { wss, electionService } = serviceLocator

  wss.on('dashboard:load', async (id) => {
    const election = await electionService.findActive()

    if (id) {
      wss.emit(id, { election })
    }
  })
}
