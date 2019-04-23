import Immutable from 'immutable'

import {
  REGISTER_FORM_SUBMIT,
  REGISTER_FORM_CHANGE,
  REGISTER_FORM_SUCCESS,
  REGISTER_FORM_FAILURE,
  LOGIN_FORM_SUBMIT,
  LOGIN_FORM_SUCCESS,
  LOGIN_FORM_FAILURE
} from './actions'

const initialState = Immutable.fromJS({
  register: {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    passwordConfirm: '',
    constituency: ''
  },
  authenticated: false,
  registered: false,
  loading: false,
  user: null,
  error: null, // login error
  errors: {} // register form errors
})

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_FORM_SUBMIT:
      return state.merge({
        loading: true,
        errors: {}
      })
    case REGISTER_FORM_CHANGE: {
      const { register, errors } = state.toJS()
      const newData = {
        ...register,
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
          register: newData,
          errors: {
            ...errors,
            ...passwordErrors
          }
        })
    }
    case REGISTER_FORM_SUCCESS:
      return state.merge({
        registered: true,
        user: action.user
      })
    case REGISTER_FORM_FAILURE:
      return state.merge({
        errors: action.errors
      })
    case LOGIN_FORM_SUBMIT:
      return state.merge({
        loading: true,
        error: null
      })
    case LOGIN_FORM_SUCCESS:
      return state.merge({
        authenticated: true,
        user: action.user
      })
    case LOGIN_FORM_FAILURE:
      return state.merge({
        error: action.error
      })
    default:
      return state
  }
}
