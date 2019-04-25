import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import {
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav
} from '@coreui/react'
// sidebar nav config
import navigation from '../../_nav'
// routes config
import routes from '../../routes'
import Page404 from '../../views/404'

const AdminFooter = React.lazy(() => import('./AdminFooter'))
const AdminHeader = React.lazy(() => import('./AdminHeader'))

class AdminLayout extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  logout(e) {
    e.preventDefault()
    window.localStorage.clear()
    this.props.history.push('/admin/login')
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <AdminHeader onLogout={e => this.logout(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...this.props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
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
                          <route.component {...props} />
                        )}
                      />
                    ) : (null)
                  })}
                  <Redirect exact from="/admin" to="/admin/dashboard" />
                  <Route component={Page404} />
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <AdminFooter />
          </Suspense>
        </AppFooter>
      </div>
    )
  }
}

AdminLayout.propTypes = {
  history: PropTypes.object.isRequired
}

export default AdminLayout
