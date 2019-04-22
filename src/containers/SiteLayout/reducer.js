import Immutable from 'immutable'

import {
  WEBSOCKET_OPEN,
  WEBSOCKET_CLOSE,
  WEBSOCKET_ERROR
} from './actions'

const initialState = Immutable.fromJS({
  websocketError: false,
  websocketClose: false,
  websocketOpen: false
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_OPEN:
      return state.merge({
        websocketOpen: true,
        websocketClose: false,
        websocketError: false
      })
    case WEBSOCKET_CLOSE:
      return state.merge({
        websocketOpen: false,
        websocketClose: true,
        websocketError: false
      })
    case WEBSOCKET_ERROR:
      return state.merge({
        websocketOpen: false,
        websocketClose: false,
        websocketError: false
      })
    default:
      return state
  }
}

export default reducer
