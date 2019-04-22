export const LOGOUT = 'LOGOUT'
export const WEBSOCKET_OPEN = 'WEBSOCKET_OPEN'
export const WEBSOCKET_CLOSE = 'WEBSOCKET_CLOSE'
export const WEBSOCKET_ERROR = 'WEBSOCKET_ERROR'

const onLogout = () => ({
  type: LOGOUT
})

const onWebsocketOpen = () => ({
  type: WEBSOCKET_OPEN
})

const onWebsocketClose = () => ({
  type: WEBSOCKET_CLOSE
})

const onWebsocketError = () => ({
  type: WEBSOCKET_ERROR
})

export {
  onLogout,
  onWebsocketOpen,
  onWebsocketClose,
  onWebsocketError
}
