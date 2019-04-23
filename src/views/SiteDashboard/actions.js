export const DASHBOARD_LOAD = 'DASHBOARD_LOAD'
export const DASHBOARD_LOAD_COMPLETE = 'DASHBOARD_LOAD_COMPLETE'
export const DASHBOARD_LOAD_FAIL = 'DASHBOARD_LOAD_FAIL'

const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR'

const onLoad = websocket => async (dispatch, getState) => {
  dispatch({ type: DASHBOARD_LOAD })

  const { auth } = await getState()
  const { user } = auth.toJS()
  const { key } = user

  const { error, election } = await websocket.send('dashboard:load', { key })
  if (error) {
    if (error === AUTHENTICATION_ERROR) {
      return dispatch({
        type: DASHBOARD_LOAD_FAIL,
        authError: true
      })
    }
    return dispatch({
      type: DASHBOARD_LOAD_FAIL,
      error: true
    })
  }
  dispatch({
    type: DASHBOARD_LOAD_COMPLETE,
    data: { election }
  })
}

export {
  onLoad
}
