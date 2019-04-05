import Immutable from 'immutable'

import {
  VOTE_LOAD,
  VOTE_LOAD_COMPLETE,
  VOTE_LOAD_FAIL
} from './actions'

const initialState = Immutable.fromJS({
  loading: true,
  error: false,
  vote: null
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case VOTE_LOAD:
      return state.merge({
        loading: true
      })
    case VOTE_LOAD_COMPLETE: {
      const { vote } = action.data
      return state.merge({
        loading: false,
        vote
      })
    }
    case VOTE_LOAD_FAIL:
      return state.merge({
        loading: false,
        error: true
      })
    default:
      return state
  }
}

export default reducer
