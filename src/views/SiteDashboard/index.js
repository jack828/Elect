import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Row
} from 'reactstrap'
import { connect } from 'react-redux'
import { onLoad } from './actions'

class SiteDashboard extends Component {
  componentDidMount() {
    if (this.props.loading) {
      this.props.onLoad(this.props.websocket)
    }
  }

  componentWillReceiveProps({ authError, ...other }) {
    console.log({ authError, ...other })
    if (authError) {
      console.log('logging out')
    }
  }

  render() {
    const {
      loading,
      election,
      error,
      authError
    } = this.props
    if (authError) {
      return null
    }
    if (error) {
      return (
        <div className="animated fadeIn pt-1 text-center">
          There was an issue performing that action.
          Please try again later.
        </div>
      )
    }
    if (loading) {
      return (
        <div className="animated fadeIn pt-1 text-center">Loading...</div>
      )
    }
    return (
      <div className="animated fadeIn">
        <Row>
          {election
            && (
            <Col xs="12">
              <Card>
                <CardHeader>
                  {election.name}
                </CardHeader>
                <CardBody>
                  {Date.now() > election.voteOpenFrom && Date.now() < election.voteOpenTo
                    ? (
                      <>
                        <Link to="/election">View results LIVE</Link>
                        <br />
                        <Link to="/vote">VOTE NOW</Link>
                      </>
                    )
                    : 'VOTING CLOSED'
                  }
                </CardBody>
              </Card>
            </Col>
            )
          }
        </Row>
      </div>
    )
  }
}

SiteDashboard.defaultProps = {
  election: null
}

SiteDashboard.propTypes = {
  onLoad: PropTypes.func.isRequired,
  websocket: PropTypes.object.isRequired,

  loading: PropTypes.bool.isRequired,
  election: PropTypes.object,
  error: PropTypes.bool.isRequired,
  authError: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  onLoad: websocket => dispatch(onLoad(websocket))
})

export default connect(
  ({ dashboard }) => dashboard.toJS(),
  mapDispatchToProps
)(SiteDashboard)
