export const VOTE_LOAD = 'VOTE_LOAD'
export const VOTE_LOAD_COMPLETE = 'VOTE_LOAD_COMPLETE'
export const VOTE_LOAD_FAIL = 'VOTE_LOAD_FAIL'

export const VOTE_CAST = 'VOTE_CAST'
export const VOTE_CAST_COMPLETE = 'VOTE_CAST_COMPLETE'
export const VOTE_CAST_FAIL = 'VOTE_CAST_FAIL'

const onLoad = websocket => async (dispatch) => {
  dispatch({ type: VOTE_LOAD })
  try {
    const data = await websocket.send('vote:load')
    dispatch({
      type: VOTE_LOAD_COMPLETE,
      data
    })
  } catch (error) {
    dispatch({ type: VOTE_LOAD_FAIL })
  }
}

const castVote = websocket => async (dispatch, vote) => {
  dispatch({ type: VOTE_CAST })

  try {
    const data = await websocket.send('vote:cast', vote)
    dispatch({
      type: VOTE_CAST_COMPLETE,
      data
    })
  } catch (error) {
    dispatch({ type: VOTE_CAST_FAIL })
  }
}

export {
  onLoad,
  castVote
}
