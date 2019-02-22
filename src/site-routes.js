import React from 'react'
import SiteLayout from './containers/SiteLayout'

const SiteDashboard = React.lazy(() => import('./views/SiteDashboard'))
const Elections = React.lazy(() => import('./views/Elections'))

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
    component: SiteLayout
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: SiteDashboard
  },
  {
    path: '/election',
    name: 'Election',
    component: Elections
  }
]

export default routes
