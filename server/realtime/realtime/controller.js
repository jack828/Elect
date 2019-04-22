const WebSocket = require('ws')
const hat = require('hat')

module.exports = (serviceLocator) => {
  const { config, logger, sessionParser, httpServer } = serviceLocator
  logger.info('Init realtime server')

  const wss = new WebSocket.Server({
    verifyClient: ({ origin, req }, done) => {
      logger.debug('Websocket verifyClient', origin)

      if (origin !== config.clientUrl) return done(false, 400, 'Bad client')

      sessionParser(req, {}, (err) => {
        if (err) return done(false, 500, 'Server error')
        done(true)
      })
    },
    server: httpServer
  })
  serviceLocator.register('wss', wss)

  // TODO:
  // - clean up to lib files
  // - clean event listeners on disconnect
  //
  wss.broadcast = (key, data) => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ [key]: data }))
    })
  }

  wss.on('connection', (ws, req) => {
    ws.id = hat()
    logger.info('New connection', ws.id)

    ws.on('message', (raw) => {
      let parsed = null
      try {
        parsed = JSON.parse(raw)
      } catch (e) {
        logger.warn('Invalid data', raw)
        return // ignore
      }
      const { id, ...data } = parsed

      logger.info('Received', id, data)
      Object.keys(data).map((key) => {
        logger.debug('Emitting', key, id, data[key])

        if (id) {
          wss.once(id, (value) => {
            ws.send(JSON.stringify({ [id]: value }))
          })
        }

        wss.emit(key, id, data[key], req)
      })
    })
  })
}
