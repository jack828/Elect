import Immutable from 'immutable'

import {
  DASHBOARD_LOAD,
  DASHBOARD_LOAD_COMPLETE,
  DASHBOARD_LOAD_FAIL
} from './actions'

const initialState = Immutable.fromJS({
  loading: true,
  error: false,
  election: null
})

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DASHBOARD_LOAD:
      return state.merge({
        loading: true
      })
    case DASHBOARD_LOAD_COMPLETE: {
      const { election } = action.data

      if (!election) return state

      const { visibleFrom, visibleTo, voteOpenFrom, voteOpenTo } = election
      return state.merge({
        loading: false,
        election: {
          ...election,
          visibleFrom: new Date(visibleFrom),
          visibleTo: new Date(visibleTo),
          voteOpenFrom: new Date(voteOpenFrom),
          voteOpenTo: new Date(voteOpenTo)
        }
      })
    }
    case DASHBOARD_LOAD_FAIL:
      return state.merge({
        loading: false,
        error: true
      })
    default:
      return state
  }
}

export default reducer
