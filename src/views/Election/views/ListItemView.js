import React from 'react'
import {
  Button
} from 'reactstrap'
import {
  format
} from 'date-fns'
import BaseComponentView from '../../lib/base-component-view'

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
        <td>{data.name}</td>
        <td>{data.parties}</td>
        <td>{format(new Date(data.visibleFrom), 'do MMMM yyyy HH:MM')}</td>
        <td>{format(new Date(data.visibleTo), 'do MMMM yyyy HH:MM')}</td>
        <td>{format(new Date(data.voteOpenFrom), 'do MMMM yyyy HH:MM')}</td>
        <td>{format(new Date(data.voteOpenTo), 'do MMMM yyyy HH:MM')}</td>
      </tr>
    )
  }
}

export default ListItemView
