import { combineReducers } from 'redux'
import site from './containers/SiteLayout/reducer'
import dashboard from './views/SiteDashboard/reducer'
import auth from './views/Pages/auth/reducer'
import vote from './views/Vote/reducer'

const reducer = combineReducers({
  site,
  dashboard,
  auth,
  vote
})

export default (state, action) => {
  if (action.type === 'RESET_ALL') {
    state = undefined
  }
  return reducer(state, action)
}
