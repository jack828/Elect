import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Row
} from 'reactstrap'
import { connect } from 'react-redux'
import VoteForm from '../VoteForm'
import { onLoad } from './actions'

class Vote extends Component {
  componentDidMount() {
    this.props.onLoad(this.props.websocket)
  }

  render() {
    const { websocket, loading, error, election, vote } = this.props
    if (loading) {
      return (
        <div className="animated fadeIn pt-1 text-center">Loading...</div>
      )
    }
    if (error) {
      return (
        <div className="animated fadeIn pt-1 text-center">
          There was an issue loading vote information. Please try again later.
        </div>
      )
    }
    return (
      <div className="animated fadeIn">
        <Row>
          {vote
            && (
            <Col className="text-center" xs="12">
              You have already voted on this election.
            </Col>
            )
          }
          {!vote && (
            <VoteForm
              websocket={websocket}
              election={election}
            />
          )}
        </Row>
      </div>
    )
  }
}

Vote.defaultProps = {
  vote: null
}

Vote.propTypes = {
  onLoad: PropTypes.func.isRequired,
  websocket: PropTypes.object.isRequired,

  election: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  vote: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  onLoad: websocket => dispatch(onLoad(websocket))
})

export default connect(
  ({ dashboard }) => dashboard.toJS(),
  mapDispatchToProps
)(Vote)
