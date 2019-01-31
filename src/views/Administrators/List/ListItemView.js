import React from 'react'
import BaseComponentView from '../../lib/base-component-view'

class ListItemView extends BaseComponentView {
  render() {
    return <p>{JSON.stringify(this.props.model.toJSON(), null, 2)}</p>
  }
}

export default ListItemView
