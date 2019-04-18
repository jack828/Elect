export const VOTE_LOAD = 'VOTE_LOAD'
export const VOTE_LOAD_COMPLETE = 'VOTE_LOAD_COMPLETE'
export const VOTE_LOAD_FAIL = 'VOTE_LOAD_FAIL'

export const VOTE_CAST = 'VOTE_CAST'
export const VOTE_CAST_COMPLETE = 'VOTE_CAST_COMPLETE'
export const VOTE_CAST_FAIL = 'VOTE_CAST_FAIL'

const onLoad = websocket => async (dispatch, getState) => {
  dispatch({ type: VOTE_LOAD })

  const { dashboard, auth } = getState()
  const { election: { _id: electionId } } = dashboard.toJS()
  const { user: { key } } = auth.toJS()

  let response
  try {
    response = await websocket.send('vote:load', { electionId, key })
  } catch (error) {
    return dispatch({
      type: VOTE_LOAD_FAIL
    })
  }

  const { error, vote } = response

  if (error) {
    return dispatch({
      type: VOTE_LOAD_FAIL
    })
  }

  dispatch({
    type: VOTE_LOAD_COMPLETE,
    data: { vote }
  })
}

const onVote = (websocket, partyId) => async (dispatch, getState) => {
  dispatch({ type: VOTE_CAST })

  const { dashboard, auth } = getState()
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
