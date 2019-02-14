const WebSocket = require('ws')


module.exports = (serviceLocator) => {
  serviceLocator.logger.info('Init realtime server')

  serviceLocator.server.on('listening', () => {
    console.log('on started')
    const wss = new WebSocket.Server({ server: serviceLocator.httpServer })
    serviceLocator.register('wss', wss)

    console.log(wss.address())
    console.log(wss.url)
    wss.on('connection', (ws) => {
      ws.on('message', (message) => {
        console.log('received: %s', message)
      })

      // ws.send(JSON.stringify({ 'election:vote': { _id: 'abc1234', party: 'absc3939u90' } }))
    })
  })
}
