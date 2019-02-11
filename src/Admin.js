import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import PrivateRoute from './lib/private-route'
import './App.scss'

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>

// Containers
const DefaultLayout = Loadable({
  loader: () => import('./containers/DefaultLayout'),
  loading
})

// Pages
const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
})

const Admin = () => (
  <HashRouter basename="admin">
    <Switch>
      <Route exact path="/login" name="Login" component={Login} />
      <PrivateRoute path="/" name="Home" component={DefaultLayout} />
    </Switch>
  </HashRouter>
)

export default Admin
