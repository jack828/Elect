const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

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

  wss.broadcast = (key, data) => {
    wss.clients.forEach((client) => {
      client.send(JSON.stringify({ [key]: data }))
    })
  }

  wss.on('connection', (client, req) => {
    client.id = uuidv4()
    logger.info('Client connect', client.id)

    const handleMessage = (raw) => {
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

        // Send response
        wss.once(id, (response) => {
          client.send(JSON.stringify({ [id]: response }))
        })

        // Trigger handler(s)
        wss.emit(key, id, data[key], req)
      })
    }

    client.on('message', handleMessage)
    client.on('close', () => {
      logger.info('Client disconnect', client.id)
      client.off('message', handleMessage)
    })
  })
}
