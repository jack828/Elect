import EventEmitter from 'events'
import hat from 'hat'

// TODO: debug logger
class Websocket extends EventEmitter {
  constructor(url) {
    super()
    this.url = url
    this.ws = new WebSocket('ws://localhost:3003')

    // TODO: disconnect, reconnect, etc - add a banner or something
    this.ws.onmessage = this.onMessage.bind(this)
    this.ws.onopen = this.onOpen.bind(this)
  }

  send(key, data, callback) {
    // TODO promises
    const id = callback && hat()
    const stringifiedData = JSON.stringify({
      id,
      [key]: data
    })
    this.ws.send(stringifiedData)
    this.once(id, (value) => {
      callback(null, value)
    })
  }

  onMessage({ data: raw }) {
    const data = this.parse(raw)
    console.log(data)
    Object.keys(data).map((key) => {
      const value = data[key]
      this.emit(key, value)
    })
  }

  onOpen() {
    this.emit('websocket:open')
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
