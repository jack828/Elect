const WebSocket = require('ws')
const hat = require('hat')

module.exports = (serviceLocator) => {
  serviceLocator.logger.info('Init realtime server')

  const wss = new WebSocket.Server({ server: serviceLocator.httpServer })
  serviceLocator.register('wss', wss)

  // TODO:
  // - clean up to lib files
  // - clean event listeners on disconnect
  wss.on('connection', (ws) => {
    ws.id = hat()
    serviceLocator.logger.info('New connection', ws.id)

    ws.on('message', (raw) => {
      let parsed = null
      try {
        parsed = JSON.parse(raw)
      } catch (e) {
        serviceLocator.logger.warn('Invalid data', raw)
      }
      const { id, ...data } = parsed

      serviceLocator.logger.info('Received', id, data)
      Object.keys(data).map((key) => {
        serviceLocator.logger.debug('Emitting', key, id, data[key])
        if (id) {
          wss.once(id, (value) => {
            ws.send(JSON.stringify({ [id]: value }))
          })
        }
        wss.emit(key, id, data[key])
      })
    })
  })
}
