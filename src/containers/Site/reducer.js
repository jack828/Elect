import Immutable from 'immutable'

import { LOGOUT } from './actions'

const initialState = Immutable.fromJS({
  apiKey: null,
  user: null
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return initialState
    default:
      return state
  }
}

export default reducer
