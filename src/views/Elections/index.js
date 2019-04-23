import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Row
} from 'reactstrap'
import { connect } from 'react-redux'
import ElectionMap from '../ElectionMap'

class Elections extends Component {
  componentDidMount() {
    if (this.props.loading) {
      this.props.history.push('/')
    }
  }

  render() {
    const { websocket, loading, election } = this.props
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
              <ElectionMap
                websocket={websocket}
                election={election}
              />
            </Col>
            )
          }
        </Row>
      </div>
    )
  }
}

Elections.defaultProps = {
  election: null
}

Elections.propTypes = {
  websocket: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  loading: PropTypes.bool.isRequired,
  election: PropTypes.object
}

export default connect(
  ({ dashboard }) => dashboard.toJS(),
  () => ({})
)(Elections)
