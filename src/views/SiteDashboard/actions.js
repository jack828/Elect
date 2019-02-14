export const DASHBOARD_LOAD = 'DASHBOARD_LOAD'
export const DASHBOARD_LOAD_COMPLETE = 'DASHBOARD_LOAD_COMPLETE'
export const DASHBOARD_LOAD_FAIL = 'DASHBOARD_LOAD_FAIL'

const onLoad = websocket => async (dispatch) => {
  dispatch({ type: DASHBOARD_LOAD })
  const data = await websocket.send('dashboard:load')
  dispatch({
    type: DASHBOARD_LOAD_COMPLETE,
    data
  })
}

export {
  onLoad
}
