import EventEmitter from 'events'
import hat from 'hat'
import createDebug from 'debug'

const WEBSOCKET_URL = process.env.NODE_ENV !== 'production'
  ? 'ws://localhost:3003'
  : `wss://${window.location.host}`

const debug = createDebug('websocket')

class Websocket extends EventEmitter {
  constructor() {
    super()
    debug('url', WEBSOCKET_URL)
    this.connect()
  }

  connect() {
    this.ws = new WebSocket(WEBSOCKET_URL)

    this.ws.onmessage = this.onMessage.bind(this)
    this.ws.onopen = this.onOpen.bind(this)
    this.ws.onclose = this.onClose.bind(this)
    this.ws.onerror = this.onError.bind(this)
  }

  reconnect() {
    this.connect()
  }

  send(key, data = '') {
    return new Promise((resolve, reject) => {
      const id = hat()
      const stringifiedData = JSON.stringify({
        id,
        [key]: data
      })
      debug('send', id, { id, key, data })

      const timeout = setTimeout(() => {
        debug('timeout', id)
        reject(new Error('WebSocket Timeout'))
      }, 5000)

      this.ws.send(stringifiedData)

      this.once(id, (value) => {
        debug('received', id, value)
        clearTimeout(timeout)
        resolve(value)
      })
    })
  }

  onMessage({ data: raw }) {
    debug('onMessage', raw)
    const data = this.parse(raw)
    Object.keys(data).map((key) => {
      const value = data[key]
      debug('emitting', key)
      this.emit(key, value)
    })
  }

  onOpen() {
    debug('open')
    this.emit('open')
  }

  onClose() {
    debug('close')
    this.emit('close')
  }

  onError() {
    debug('error')
    this.emit('error')
  }

  off(event, func) {
    this.removeListener(event, func)
  }

  parse(raw) {
    let data = ''
    try {
      data = JSON.parse(raw)
    } catch (e) {
      console.error('could not parse ws data', raw)
    }
    return data
  }
}

export default Websocket
