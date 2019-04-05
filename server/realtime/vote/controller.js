module.exports = (serviceLocator) => {
  const { wss, voteService } = serviceLocator

  wss.on('vote:load', async (id) => {
    if (id) {
      wss.emit(id, { })
    }
  })
}
