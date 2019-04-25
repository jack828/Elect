import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import PrivateRoute from './lib/private-route'

import './App.scss'

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>

// Containers
const SiteLayout = Loadable({
  loader: () => import('./layouts/Site'),
  loading
})

const AdminLayout = Loadable({
  loader: () => import('./layouts/Admin'),
  loading
})

// Pages
const AdminLogin = Loadable({
  loader: () => import('./views/admin/Login'),
  loading
})

const App = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/admin/login" component={AdminLogin} />
      <PrivateRoute path="/admin" component={AdminLayout} />
      <Route path="/" component={SiteLayout} />
    </Switch>
  </HashRouter>
)

export default App
