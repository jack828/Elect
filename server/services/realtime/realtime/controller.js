const WebSocket = require('ws')
const hat = require('hat')

module.exports = (serviceLocator) => {
  serviceLocator.logger.info('Init realtime server')

  serviceLocator.server.on('listening', () => {
    console.log('on started')
    const wss = new WebSocket.Server({ server: serviceLocator.httpServer })
    serviceLocator.register('wss', wss)

    console.log(wss.address())
    console.log(wss.url)
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
            console.log('binding once for id', id)
            wss.once(id, (value) => {
            console.log('id callback triggered!', id, value)
              ws.send(JSON.stringify({ [id]: value }))
            })
          }
          wss.emit(key, id, data[key])
        })
      })

      // ws.send(JSON.stringify({ 'election:vote': { _id: 'abc1234', party: 'absc3939u90' } }))
    })

    wss.on('test', (id, data) => {
      console.log('recieved `test`', { id, data })

      // async something

      if (id) {
        console.log('emitting callback id', id)
        wss.emit(id, { new: 'data' })
      }
    })
  })
}
