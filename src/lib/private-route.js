import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={({ history, ...other }) => {
      // TODO: bad practice IMO, should be handled through redux state
      if (!window.localStorage.getItem('apiKey')) {
        history.push('/login')
      }
      return (
        <Component history={history} {...other} />
      )
    }
    }
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired
}

export default PrivateRoute
