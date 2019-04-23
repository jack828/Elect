import React, { Component } from 'react'
import {
  Col,
  Row
} from 'reactstrap'

class Dashboard extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col>
            <h1>Welcome to the Elect administrative CMS.</h1>
            <p>Use the links in the sidebar to navigate through content.</p>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Dashboard
