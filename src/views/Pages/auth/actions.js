export const REGISTER_FORM_SUBMIT = 'REGISTER_FORM_SUBMIT'
export const REGISTER_FORM_CHANGE = 'REGISTER_FORM_CHANGE'
export const REGISTER_FORM_SUCCESS = 'REGISTER_FORM_SUCCESS'
export const REGISTER_FORM_FAILURE = 'REGISTER_FORM_FAILURE'

const change = data => ({
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
  const { data } = getState().auth.toJS()

  const { errors, user } = await websocket.send('register', data)

  if (errors) return dispatch(registerFailure(errors))
  if (user) return dispatch(registerSuccess(user))
}

export {
  register,
  change
}
