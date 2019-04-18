export const DASHBOARD_LOAD = 'DASHBOARD_LOAD'
export const DASHBOARD_LOAD_COMPLETE = 'DASHBOARD_LOAD_COMPLETE'
export const DASHBOARD_LOAD_FAIL = 'DASHBOARD_LOAD_FAIL'

const onLoad = websocket => async (dispatch, getState) => {
  dispatch({ type: DASHBOARD_LOAD })

  const { auth } = await getState()
  const { user } = auth.toJS()
  const { key } = user // TODO keyExpiry

  const data = await websocket.send('dashboard:load', { key })
  dispatch({
    type: DASHBOARD_LOAD_COMPLETE,
    data
  })
}

export {
  onLoad
}
