import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import {
  Alert,
  Button,
  Container
} from 'reactstrap'
import { connect } from 'react-redux'
import { AppBreadcrumb, AppHeader } from '@coreui/react'

import Page404 from '../../views/Pages/Page404'
import Login from '../../views/Pages/SiteLogin'
import Register from '../../views/Pages/Register'
import siteRoutes from '../../site-routes'

import {
  onWebsocketOpen,
  onWebsocketClose,
  onWebsocketError
} from './actions'
import {
  logout
} from '../../views/Pages/auth/actions'

const SiteHeader = React.lazy(() => import('./SiteHeader'))

class SiteLayout extends Component {
  componentDidMount() {
    this.props.websocket.on('open', this.props.onWebsocketOpen)
    this.props.websocket.on('close', this.props.onWebsocketClose)
    this.props.websocket.on('error', this.props.onWebsocketError)
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  logout() {
    this.props.onLogout()
    this.props.history.push('/login')
  }

  renderRoutes() {
    let routes = []
    if (this.props.authenticated) {
      routes = [
        ...siteRoutes.map((route) => {
          return route.component ? (
            <Route
              key={`Route-${route.path}`}
              path={route.path}
              exact={route.exact}
              name={route.name}
              render={props => (
                <route.component {...props} websocket={this.props.websocket} />
              )}
            />
          ) : (null)
        }),
        <Redirect
          key="Route-Redirect-Dashboard"
          exact
          from="/"
          to="/dashboard"
        />,
        <Redirect
          key="Route-Redirect-Login"
          exact
          from="/login"
          to="/dashboard"
        />,
        <Route
          key="Route-404"
          component={Page404}
        />
      ]
    } else {
      routes = [
        <Route
          key="Route-Register"
          exact
          path="/register"
          render={props => (
            <Register {...props} websocket={this.props.websocket} />
          )}
        />,
        <Route
          key="Route-Login"
          render={props => (
            <Login {...props} websocket={this.props.websocket} />
          )}
        />
      ]
    }

    return routes
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <SiteHeader onLogout={() => this.logout()} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <main className="main">
            <AppBreadcrumb appRoutes={siteRoutes} />
            <Container fluid>
              {this.props.websocketClose && (
                <Alert className="text-center" color="danger">
                  Connection to the server has been lost.
                  {' '}
                  <Button color="primary" onClick={() => this.props.websocket.reconnect()}>
                    Click here to reconnect
                  </Button>
                </Alert>
              )}
              <Suspense fallback={this.loading()}>
                <Switch>
                  {this.renderRoutes()}
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
      </div>
    )
  }
}

SiteLayout.propTypes = {
  onLogout: PropTypes.func.isRequired,
  onWebsocketOpen: PropTypes.func.isRequired,
  onWebsocketClose: PropTypes.func.isRequired,
  onWebsocketError: PropTypes.func.isRequired,

  history: PropTypes.object.isRequired,
  websocket: PropTypes.object.isRequired,

  authenticated: PropTypes.bool.isRequired,
  websocketOpen: PropTypes.bool.isRequired,
  websocketClose: PropTypes.bool.isRequired,
  websocketError: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
  onWebsocketOpen: () => dispatch(onWebsocketOpen()),
  onWebsocketClose: () => dispatch(onWebsocketClose()),
  onWebsocketError: () => dispatch(onWebsocketError())
})

export default connect(
  ({ auth, site }) => ({ ...auth.toJS(), ...site.toJS() }),
  mapDispatchToProps
)(SiteLayout)
