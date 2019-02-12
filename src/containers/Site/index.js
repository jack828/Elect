import React, { Component } from 'react'

import SiteLayout from './SiteLayout'

class Site extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <SiteLayout {...this.props} />
    )
  }
}

export default Site
