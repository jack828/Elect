/* eslint-disable */
import React from 'react'
import classnames from 'classnames'
import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Col,
  Collapse,
  Row
} from 'reactstrap'
import BaseComponentView from '../../lib/base-component-view'

class ListItemView extends BaseComponentView {
  // TODO BaseListItemView
  constructor(props) {
    super(props)
    this.state = {
      collapse: true
    }
    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle() {
    this.setState(({ collapse }) => ({ collapse: !collapse }))
  }

  render() {
    const data = this.props.model.toJSON()
    const cardClasses = classnames({
       'card-accent-danger': !data.enabled,
       'card-accent-success': data.enabled
    })
    return (
      <Card className={cardClasses}>
        <CardHeader>
          {data.firstName} {data.lastName}
          <div className="card-header-actions">
            <a
              className="card-header-action"
              onClick={() => this.props.handleEdit(data._id)}
            >
              <i className="icon-note" />
            </a>
            <a
              className="card-header-action btn btn-minimize"
              onClick={this.handleToggle}
            >
              {this.state.collapse
                ? <i className="icon-arrow-up" />
                : <i className="icon-arrow-down" />
              }
            </a>
          </div>
        </CardHeader>
        <Collapse isOpen={this.state.collapse}>
          <CardBody className="list-item-body">
            <dl>
              <dt>Email Address: </dt>
              <dd>{data.emailAddress}</dd>
              <dt>Role: </dt>
              <dd>{data.role || 'N/A'}</dd>
              <dt>Enabled: </dt>
              <dd>{data.enabled ? 'YES' : 'NO'}</dd>
            </dl>
          </CardBody>
        </Collapse>
      </Card>
    )
  }
}

export default ListItemView
