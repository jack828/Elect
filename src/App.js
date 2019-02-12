import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'

import './App.scss'

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>

// Containers
const SiteLayout = Loadable({
  loader: () => import('./containers/Site'),
  loading
})

const AdminLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
})

// Pages
const AdminLogin = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
})

const SiteLogin = Loadable({
  loader: () => import('./views/Pages/SiteLogin'),
  loading
})


const App = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminLayout} />
      <Route exact path="/login" component={SiteLogin} />
      <Route path="/" component={SiteLayout} />
    </Switch>
  </HashRouter>
)

export default App
