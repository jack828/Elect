import Immutable from 'immutable'

import {
  REGISTER_FORM_CHANGE
} from './actions'

const initialState = Immutable.fromJS({
  data: {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: ''
  },
  authenticated: false,
  loading: false,
  user: null,
  error: null,
  errorProperties: {}
})

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_FORM_CHANGE:
      return state.mergeIn([ 'data' ], action.data)
    default:
      return state
  }
}
