const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

module.exports = (serviceLocator) => {
  serviceLocator.logger.info('starting realtime')
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message)
    })

    // ws.send(JSON.stringify({ 'election:vote': { _id: 'abc1234', party: 'absc3939u90' } }))
  })
}
