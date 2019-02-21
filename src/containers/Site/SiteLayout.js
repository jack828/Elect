import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'
import {
  AppBreadcrumb,
  AppHeader
} from '@coreui/react'
// routes config
import siteRoutes from '../../site-routes'
import Page404 from '../../views/Pages/Page404'
import Login from '../../views/Pages/SiteLogin'
import Register from '../../views/Pages/Register'
import { onLogout } from './actions'

const SiteHeader = React.lazy(() => import('./SiteHeader'))

class SiteLayout extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  logout() {
    // TODO logout properly
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
          key="Route-Redirect"
          exact
          from="/"
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
            <SiteHeader onLogout={this.props.onLogout} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <main className="main">
            <AppBreadcrumb appRoutes={siteRoutes} />
            <Container fluid>
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

SiteLayout.defaultProps = {
  authenticated: false
}

SiteLayout.propTypes = {
  onLogout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  websocket: PropTypes.object.isRequired,

  authenticated: PropTypes.bool
}

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(onLogout())
})

export default connect(
  ({ auth }) => auth.toJS(),
  mapDispatchToProps
)(SiteLayout)
