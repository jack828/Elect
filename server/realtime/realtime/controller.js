const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

module.exports = (serviceLocator) => {
  const { config, logger, httpServer } = serviceLocator
  logger.info('Init realtime server')

  const wss = new WebSocket.Server({
    perMessageDeflate: false,
    verifyClient: ({ origin }, done) => {
      logger.debug('Websocket verifyClient', origin)

      if (origin !== config.clientUrl) return done(false, 400, 'Bad client')
      done(true)
    },
    server: httpServer
  })
  serviceLocator.register('wss', wss)

  wss.broadcast = (key, data) => {
    const stringifiedData = JSON.stringify({ [key]: data })
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(stringifiedData)
      }
    })
  }


  wss.on('connection', (client) => {
    client.id = uuidv4()
    client.session = {
      id: client.id
    }

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
        wss.emit(key, id, data[key], client)
      })
    }

    client.on('message', handleMessage)
    client.on('close', () => {
      logger.info('Client disconnect', client.id)
      client.off('message', handleMessage)
    })
  })
}
