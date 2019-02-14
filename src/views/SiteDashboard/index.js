import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    this.props.onLoad(this.props.websocket)
  }

  render() {
    const { loading, election } = this.props
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
                    ? 'VOTING OPEN'
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
  election: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  onLoad: websocket => dispatch(onLoad(websocket))
})

export default connect(
  ({ dashboard }) => dashboard.toJS(),
  mapDispatchToProps
)(SiteDashboard)
