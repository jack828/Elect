export const REGISTER_FORM_CHANGE = 'REGISTER_FORM_CHANGE'

const change = data => ({
  type: REGISTER_FORM_CHANGE,
  data
})

const onRegister = websocket => (dispatch, getState) => {
  const { data } = getState().auth.toJS()
  console.log(websocket, data)
}

export {
  onRegister,
  change
}
