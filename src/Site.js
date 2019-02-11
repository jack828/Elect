import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import PrivateRoute from './lib/private-route'

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>

// Containers
const Layout = Loadable({
  loader: () => import('./containers/Site'),
  loading
})

// Pages
const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
})

const Site = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/login" name="Login" component={Login} />
      <PrivateRoute path="/" name="Home" component={Layout} />
    </Switch>
  </HashRouter>
)

export default Site
