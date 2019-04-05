import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardBody,
  Col
} from 'reactstrap'

class VoteForm extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    const { election } = this.props
    return (
      <Col xs="12">
        <Card>
          <CardHeader>
            Vote -
            {' '}
            {election.name}
          </CardHeader>
          <CardBody>
            <ul>
              {election.parties.map(({ _id, name }) => (
                <li key={_id}>{name}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

VoteForm.defaultProps = {

}

VoteForm.propTypes = {
  election: PropTypes.shape({
    parties: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
  // onVote: PropTypes.func.isRequired
}

export default VoteForm
