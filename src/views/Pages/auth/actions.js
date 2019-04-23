export const REGISTER_FORM_SUBMIT = 'REGISTER_FORM_SUBMIT'
export const REGISTER_FORM_CHANGE = 'REGISTER_FORM_CHANGE'
export const REGISTER_FORM_SUCCESS = 'REGISTER_FORM_SUCCESS'
export const REGISTER_FORM_FAILURE = 'REGISTER_FORM_FAILURE'
export const LOGIN_FORM_SUBMIT = 'LOGIN_FORM_SUBMIT'
export const LOGIN_FORM_SUCCESS = 'LOGIN_FORM_SUCCESS'
export const LOGIN_FORM_FAILURE = 'LOGIN_FORM_FAILURE'

const changeRegister = data => ({
  type: REGISTER_FORM_CHANGE,
  data
})

const registerFailure = errors => ({
  type: REGISTER_FORM_FAILURE,
  errors
})

const registerSuccess = user => ({
  type: REGISTER_FORM_SUCCESS,
  user
})

const register = websocket => async (dispatch, getState) => {
  dispatch({ type: REGISTER_FORM_SUBMIT })
  const { register: data } = getState().auth.toJS()

  const { errors, user } = await websocket.send('register', data)

  if (errors) return dispatch(registerFailure(errors))
  if (user) return dispatch(registerSuccess(user))
}

const loginFailure = error => ({
  type: LOGIN_FORM_FAILURE,
  error
})

const loginSuccess = user => ({
  type: LOGIN_FORM_SUCCESS,
  user
})

const login = (websocket, data) => async (dispatch) => {
  dispatch({ type: LOGIN_FORM_SUBMIT })

  const { errors, user } = await websocket.send('login', data)
  console.log(errors)

  if (errors) return dispatch(loginFailure(errors))
  if (user) return dispatch(loginSuccess(user))
}

export {
  register,
  changeRegister,
  login
}
