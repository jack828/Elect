const constituencyData = require('./constituencies.json')

module.exports = (serviceLocator) => {
  const { wss } = serviceLocator

  wss.on('constituencies:load', async (id) => {
    wss.emit(id, constituencyData)
  })
}
