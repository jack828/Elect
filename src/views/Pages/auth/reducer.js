import Immutable from 'immutable'

import {
  REGISTER_FORM_SUBMIT,
  REGISTER_FORM_CHANGE,
  REGISTER_FORM_SUCCESS,
  REGISTER_FORM_FAILURE
} from './actions'

const initialState = Immutable.fromJS({
  data: {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    passwordConfirm: ''
  },
  authenticated: false,
  loading: false,
  user: null,
  error: null,
  errors: {}
})

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_FORM_SUBMIT:
      return state.merge({
        loading: true,
        errors: {}
      })
    case REGISTER_FORM_CHANGE: {
      const { data, errors } = state.toJS()
      const newData = {
        ...data,
        ...action.data
      }
      const { password, passwordConfirm } = newData

      const passwordErrors = (password && passwordConfirm && password !== passwordConfirm)
        ? { passwordConfirm: 'Passwords do not match' }
        : {}

      const [ key ] = Object.keys(action.data)

      delete errors[key]

      return state
        .merge({
          data: newData,
          errors: {
            ...errors,
            ...passwordErrors
          }
        })
    }
    case REGISTER_FORM_SUCCESS:
      return state.merge({
        authenticated: true,
        user: action.user
      })
    case REGISTER_FORM_FAILURE:
      return state.merge({
        errors: action.errors
      })
    default:
      return state
  }
}
