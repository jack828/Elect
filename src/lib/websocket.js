import EventEmitter from 'events'
import uuidv4 from 'uuid/v4'
import createDebug from 'debug'

const { NODE_ENV } = process.env

const isSecure = window.location.protocol === 'https:'
const wsProtocol = isSecure ? 'wss' : 'ws'

const WEBSOCKET_URL = NODE_ENV !== 'production'
  ? `${wsProtocol}://localhost:3003`
  : `${wsProtocol}://${window.location.host}`

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

  send(eventKey, data = '') {
    return new Promise((resolve, reject) => {
      const id = uuidv4()
      debug('send', id, { id, eventKey, data })

      const timeout = setTimeout(() => {
        debug('timeout', id)
        reject(new Error('WebSocket Timeout'))
      }, 20000) // 20 seconds

      this.ws.send(JSON.stringify({
        id,
        [eventKey]: data
      }))

      this.once(id, (response) => {
        debug('received', id, response)
        clearTimeout(timeout)
        resolve(response)
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
