import { combineReducers } from 'redux'
import site from './containers/Site/reducer'

const reducer = combineReducers({
  site
})

export default (state, action) => {
  if (action.type === 'RESET_ALL') {
    state = undefined
  }
  return reducer(state, action)
}
