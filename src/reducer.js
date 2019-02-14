import { combineReducers } from 'redux'
import site from './containers/Site/reducer'
import dashboard from './views/SiteDashboard/reducer'

const reducer = combineReducers({
  site,
  dashboard
})

export default (state, action) => {
  if (action.type === 'RESET_ALL') {
    state = undefined
  }
  return reducer(state, action)
}
