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
import routes from '../../site-routes'
import Page404 from '../../views/Pages/Page404'
import { onLogout } from './actions'

const SiteHeader = React.lazy(() => import('./SiteHeader'))

class SiteLayout extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  logout() {
    this.props.onLogout()
    this.props.history.push('/login')
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
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route) => {
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
                  })}
                  <Redirect exact from="/" to="/dashboard" />
                  <Route component={Page404} />
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
  history: PropTypes.object.isRequired,
  websocket: PropTypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(onLogout())
})

export default connect(
  ({ site }) => site.toJS(),
  mapDispatchToProps
)(SiteLayout)
