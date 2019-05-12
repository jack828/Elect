const WebSocket = require('ws')
const uuidv4 = require('uuid/v4')

module.exports = (serviceLocator) => {
  const { metrics, logger, httpServer } = serviceLocator
  logger.info('Init realtime server')

  const wss = new WebSocket.Server({
    perMessageDeflate: false,
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

  // Keep track of connected clients
  setInterval(() => {
    metrics.guage('clients.connected', wss.clients.size)
  }, 5000)

  wss.on('connection', (client) => {
    client.id = uuidv4()
    client.session = {
      id: client.id
    }

    metrics.increment('client.connect')
    logger.info('Client connect', client.id)

    const handleMessage = (raw) => {
      metrics.increment('client.message')
      let parsed = null
      try {
        parsed = JSON.parse(raw)
      } catch (e) {
        logger.warn('Invalid data', raw)
        return // ignore
      }
      const { id, ...data } = parsed

      logger.debug('Received', id, data)
      Object.keys(data).map((key) => {
        logger.debug('Emitting', key, id, data[key])

        // Send response
        wss.once(id, (response) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ [id]: response }))
          }
        })

        // Trigger handler(s)
        wss.emit(key, id, data[key], client)
      })
    }

    client.on('message', handleMessage)
    client.on('error', (error) => {
      logger.info('Client error', client.id, error)
      metrics.increment('client.disconnect')
      metrics.increment('client.error')
      client.close()
    })
    client.on('close', () => {
      metrics.increment('client.disconnect')
      logger.info('Client disconnect', client.id)
      client.off('message', handleMessage)
    })
  })
}
