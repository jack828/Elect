import React from 'react'
import {
  Col,
  Row
} from 'reactstrap'
import BaseComponentView from './base-component-view'

class BaseListView extends BaseComponentView {
  constructor(props) {
    super(props)
    this.state = {
      models: []
    }

    this.addListItem = this.addListItem.bind(this)
    this.removeListItem = this.removeListItem.bind(this)
    this.resetListItems = this.resetListItems.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.handleEdit = this.handleEdit.bind(this)

    // eslint-disable-next-line
    this.collection = props.collection

    this.collection.on('add', this.addListItem)
    this.collection.on('remove', this.removeListItem)
    this.collection.on('reset', this.resetListItems)
  }

  addListItem(model, index) {
    // TODO might not be needed, but keeping for references
    const listItem = new this.ListItemView(
      this.serviceLocator,
      model,
      index,
      this.collection.length
    )
    this.setState(({ models }) => ({
      models: [ ...models, model ]
    }))
    return listItem
  }

  removeListItem(model) {
    this.setState(({ models }) => ({
      models: [ ...models.filter(({ id }) => id === model.id) ]
    }))
  }

  resetListItems(models, previousModels) {
    previousModels.forEach(this.removeListItem)
    models.forEach(this.addListItem)
  }

  handleFilter(filter) {
    this.collection.applyFilter(filter)
  }

  handleEdit(_id) {
    window.location.hash = `${this.url}/${_id}`
  }

  render() {
    return (
      <Row>
        <Col sm="8">
          <h1>{this.name}</h1>
          {this.state.models.map(model => (
            <this.ListItemView key={model.id} model={model} handleEdit={this.handleEdit} />
          ))}
        </Col>
        <Col sm="4">
          <this.FilterView
            handleFilter={this.handleFilter}
          />
        </Col>
      </Row>
    )
  }
}

export default BaseListView
