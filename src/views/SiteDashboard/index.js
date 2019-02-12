import React, { Component } from 'react'
import {
  Row
} from 'reactstrap'

class SiteDashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    // Load inital data

  }

  render() {
    const { loading } = this.state
    if (loading) {
      return (
        <div className="animated fadeIn pt-1 text-center">Loading...</div>
      )
    }
    return (
      <div className="animated fadeIn">
        <Row />
      </div>
    )
  }
}

export default SiteDashboard
