import EventEmitter from 'events'
import hat from 'hat'

// TODO: debug logger
class Websocket extends EventEmitter {
  constructor(url) {
    super()
    this.url = url
    this.ws = new WebSocket('ws://localhost:3003')

    this.ws.onmessage = this.onMessage.bind(this)
    this.ws.onopen = this.onOpen.bind(this)
    this.ws.onclose = this.onClose.bind(this)
    this.ws.onError = this.onError.bind(this)
  }

  send(key, data = '') {
    // TODO: Wrap in setTimeout
    return new Promise((resolve) => {
      const id = hat()
      const stringifiedData = JSON.stringify({
        id,
        [key]: data
      })
      this.ws.send(stringifiedData)
      this.once(id, (value) => {
        resolve(value)
      })
    })
  }

  onMessage({ data: raw }) {
    const data = this.parse(raw)
    Object.keys(data).map((key) => {
      const value = data[key]
      this.emit(key, value)
    })
  }

  onOpen() {
    this.emit('open')
  }

  onClose() {
    this.emit('close')
  }

  onError() {
    this.emit('error')
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
