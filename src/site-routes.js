import React from 'react'
import SiteLayout from './layouts/Site'

const SiteDashboard = React.lazy(() => import('./views/SiteDashboard'))
const Elections = React.lazy(() => import('./views/Elections'))
const Vote = React.lazy(() => import('./views/Vote'))

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
  },
  {
    path: '/vote',
    name: 'Vote',
    component: Vote
  }
]

export default routes
