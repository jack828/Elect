import React from 'react'
import SiteLayout from './containers/Site'

const SiteDashboard = React.lazy(() => import('./views/SiteDashboard'))

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
  }
]

export default routes
