import React from 'react'
import {
  Badge,
  Button
} from 'reactstrap'
import BaseComponentView from '../../../lib/base-component-view'

class ListItemView extends BaseComponentView {
  render() {
    const data = this.props.model.toJSON()

    return (
      <tr key={data._id}>
        <th scope="row">
          <Button
            block
            color="link"
            onClick={() => this.props.handleEdit(data._id)}
          >
            <i className="fa fa-fw fa-edit" />
          </Button>
        </th>
        <td>{data.firstName}</td>
        <td>{data.lastName}</td>
        <td>{data.emailAddress}</td>
        <td>
          <Badge color={data.enabled ? 'success' : 'data'}>
            {data.enabled ? 'enabled' : 'disabled'}
          </Badge>
        </td>
      </tr>
    )
  }
}

export default ListItemView
