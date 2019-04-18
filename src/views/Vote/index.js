import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Col,
  Row
} from 'reactstrap'
import { connect } from 'react-redux'
import VoteForm from '../VoteForm'
import VoteInfo from '../VoteInfo'
import {
  onLoad,
  onVote
} from './actions'

class Vote extends Component {
  componentDidMount() {
    this.props.handleLoad(this.props.websocket)
  }

  render() {
    const {
      websocket,
      handleVote,
      loading,
      error,
      errorMessage,
      election,
      vote,
      voting
    } = this.props

    if (loading) {
      return (
        <div className="animated fadeIn pt-1 text-center">Loading...</div>
      )
    }
    if (error) {
      return (
        <div className="animated fadeIn pt-1 text-center">
          There was an issue performing that action. Please try again later.
        </div>
      )
    }
    return (
      <div className="animated fadeIn">
        <Row>
          {errorMessage && (
            <Col className="text-center" xs="12">
              <Alert className="text-center" color="danger">
                {errorMessage}
              </Alert>
            </Col>
          )}
          {vote
            && (
            <Col className="text-center" xs="12">
              <VoteInfo election={election} vote={vote} />
            </Col>
            )
          }
          {!vote && !voting && (
            <VoteForm
              onVote={partyId => handleVote(websocket, partyId)}
              election={election}
            />
          )}
          {voting && (
            <Col className="text-center" xs="12">
              <Alert className="text-center" color="warning">
                Your vote is being submitted, please wait.
              </Alert>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}

Vote.defaultProps = {
  vote: null,
  errorMessage: null
}

Vote.propTypes = {
  handleLoad: PropTypes.func.isRequired,
  handleVote: PropTypes.func.isRequired,
  websocket: PropTypes.object.isRequired,

  election: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  voting: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  vote: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  handleLoad: websocket => dispatch(onLoad(websocket)),
  handleVote: (websocket, _id) => dispatch(onVote(websocket, _id))
})

export default connect(
  ({ dashboard, vote }) => ({ ...dashboard.toJS(), ...vote.toJS() }),
  mapDispatchToProps
)(Vote)
