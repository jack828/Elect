import React from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={({ history, ...other }) => {
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
