import Immutable from 'immutable'

import {
  VOTE_LOAD,
  VOTE_LOAD_COMPLETE,
  VOTE_LOAD_FAIL,
  VOTE_CAST,
  VOTE_CAST_COMPLETE,
  VOTE_CAST_FAIL
} from './actions'

const initialState = Immutable.fromJS({
  loading: true,
  voting: false,
  error: false,
  errorMessage: null,
  vote: null
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case VOTE_LOAD:
      return state.merge({
        loading: true,
        error: false
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
    case VOTE_CAST:
      return state.merge({
        voting: true,
        error: false
      })
    case VOTE_CAST_COMPLETE: {
      const { vote } = action
      return state.merge({
        voting: false,
        vote
      })
    }
    case VOTE_CAST_FAIL: {
      const { error } = action
      return state.merge({
        voting: false,
        errorMessage: error
      })
    }
    default:
      return state
  }
}

export default reducer
