import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap'
import { format } from 'date-fns'

const VoteInfo = ({ election, vote }) => (
  <Card>
    <CardHeader>
      {'Your Vote - '}
      {election.name}
    </CardHeader>
    <CardBody>
      <Card>
        <CardBody className="clearfix p-3">
          <i className="fa fa-check bg-success p-3 font-2xl mr-3 float-left" />
          <div className="h3 mb-0 text-success mt-2">
            {vote.party.name}
          </div>
          <div className="text-muted text-uppercase font-weight-bold font-xs">
            {'Cast on '}
            {format(new Date(vote.createdDate), 'do MMMM yyyy')}
            {' at '}
            {format(new Date(vote.createdDate), 'hh:mm:ss aa')}
          </div>
        </CardBody>
      </Card>
    </CardBody>
  </Card>
)

VoteInfo.propTypes = {
  election: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  vote: PropTypes.shape({
    party: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    createdDate: PropTypes.string.isRequired
  }).isRequired
}

export default VoteInfo
