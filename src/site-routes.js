// import React from 'react'
import SiteHome from './containers/Site'

// const SiteHome = React.lazy(() => import('./views/Administrators/views/Form'))

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
    component: SiteHome
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard'
  }
]

export default routes
