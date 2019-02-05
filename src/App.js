import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
// import { renderRoutes } from 'react-router-config'
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

const Register = Loadable({
  loader: () => import('./views/Pages/Register'),
  loading
})

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
})

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
})

// eslint-disable-next-line
class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login" component={Login} />
          <Route exact path="/register" name="Register" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />
          <PrivateRoute path="/" name="Home" component={DefaultLayout} />
        </Switch>
      </HashRouter>
    )
  }
}

export default App
