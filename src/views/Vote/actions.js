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

const onVote = (websocket, partyId) => async (dispatch, getState) => {
  dispatch({ type: VOTE_CAST })

  const { dashboard, auth } = await getState()
  const { election: { _id: electionId } } = dashboard.toJS()
  const { user: { key } } = auth.toJS()

  let response
  try {
    response = await websocket.send('vote:cast', { electionId, partyId, key })
  } catch (error) {
    return dispatch({
      type: VOTE_CAST_FAIL,
      error: 'There was an issue casting your vote'
    })
  }

  const { error, vote } = response

  if (error) {
    return dispatch({
      type: VOTE_CAST_FAIL,
      error
    })
  }

  dispatch({
    type: VOTE_CAST_COMPLETE,
    vote
  })
}

export {
  onLoad,
  onVote
}
