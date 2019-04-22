import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Row
} from 'reactstrap'
import { connect } from 'react-redux'
import ElectionMap from '../ElectionMap'
import { onLoad } from './actions'

class Elections extends Component {
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
              <ElectionMap
                websocket={this.props.websocket}
                election={this.props.election}
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
)(Elections)
