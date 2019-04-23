import React from 'react'
import AdminLayout from './containers/AdminLayout'

const AdministratorForm = React.lazy(() => import('./views/admin/Administrators/views/Form'))
const AdministratorList = React.lazy(() => import('./views/admin/Administrators/views/List'))

const PartyForm = React.lazy(() => import('./views/admin/Parties/views/Form'))
const PartyList = React.lazy(() => import('./views/admin/Parties/views/List'))

const ElectionForm = React.lazy(() => import('./views/admin/Election/views/Form'))
const ElectionList = React.lazy(() => import('./views/admin/Election/views/List'))

const Dashboard = React.lazy(() => import('./views/Dashboard'))

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  {
    path: '/admin',
    exact: true,
    name: 'Home',
    component: AdminLayout
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },

  {
    path: '/admin/administrators/new',
    exact: true,
    name: 'New Administrator',
    component: AdministratorForm
  },
  {
    path: '/admin/administrators/list',
    exact: true,
    name: 'List Administrators',
    component: AdministratorList
  },
  {
    path: '/admin/administrators/:id',
    name: 'Edit Administrator',
    component: AdministratorForm
  },

  {
    path: '/admin/parties/new',
    exact: true,
    name: 'New Party',
    component: PartyForm
  },
  {
    path: '/admin/parties/list',
    exact: true,
    name: 'List Parties',
    component: PartyList
  },
  {
    path: '/admin/parties/:id',
    name: 'Edit Party',
    component: PartyForm
  },

  {
    path: '/admin/elections/new',
    exact: true,
    name: 'New Election',
    component: ElectionForm
  },
  {
    path: '/admin/elections/list',
    exact: true,
    name: 'List Elections',
    component: ElectionList
  },
  {
    path: '/admin/elections/:id',
    name: 'Edit Election',
    component: ElectionForm
  }
]

export default routes
