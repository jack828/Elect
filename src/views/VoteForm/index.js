import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Table,
  Row,
  Popover,
  PopoverBody,
  PopoverHeader
} from 'reactstrap'
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities'

const warningColour = getStyle('--warning')

class VoteForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: undefined,
      submitPopoverOpen: false
    }

    this.handleVote = this.handleVote.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState(({ submitPopoverOpen }) => ({
      submitPopoverOpen: !submitPopoverOpen
    }))
  }

  handleClick(_id) {
    this.setState({ selected: _id })
  }

  handleVote() {
    this.props.onVote(this.state.selected)
  }

  renderOptionRow({ _id, name, selected, warning }) {
    return (
      <tr
        key={`VoteParty${_id}`}
        onClick={() => this.handleClick(_id)}
        className="text-center"
        style={{ backgroundColor: warning && warningColour }}
      >
        <td>
          <div>{name}</div>
        </td>
        <td>
          <i
            className={classNames('fa fa-fw', {
              'fa-square-o': !selected,
              'fa-check-square-o': selected
            })}
            style={{ fontSize: '24px' }}
          />
        </td>
      </tr>
    )
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
            <Row>
              <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                <thead className="thead-light">
                  <tr>
                    <th className="text-center">Party Name</th>
                    <th className="text-center">Vote</th>
                  </tr>
                </thead>
                <tbody>
                  {election.parties.map(({ _id, name }) => (
                    this.renderOptionRow({ _id, name, selected: this.state.selected === _id })
                  ))}
                  {this.renderOptionRow({
                    _id: null,
                    name: 'Spoil Ballot',
                    selected: this.state.selected === null,
                    warning: true
                  })}
                </tbody>
              </Table>
            </Row>

            <hr />

            <Row className="text-center">
              <Button
                disabled={this.state.selected === undefined}
                color="primary"
                onClick={this.toggle}
                id="VotePopover"
                className="mx-auto"
              >
                Submit Vote
              </Button>
              <Popover
                isOpen={this.state.submitPopoverOpen}
                toggle={this.toggle}
                target="VotePopover"
                placement="bottom"
              >
                <PopoverHeader>Are you sure?</PopoverHeader>
                <PopoverBody>
                  Votes cannot be changed after they are cast.
                  <br />
                  <Button
                    color="danger"
                    className="mr-5"
                    onClick={this.toggle}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="success"
                    className="ml-5"
                    onClick={this.handleVote}
                  >
                    VOTE
                  </Button>
                </PopoverBody>
              </Popover>
            </Row>
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
  }).isRequired,
  onVote: PropTypes.func.isRequired
}

export default VoteForm
