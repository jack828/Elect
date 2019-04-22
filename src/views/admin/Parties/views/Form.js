import React from 'react'
import {
  Col,
  FormGroup,
  FormFeedback,
  Input,
  Label
} from 'reactstrap'
import BaseFormView from '../../../lib/base-form-view'
import createSchema from '../../../../../server/service/party/schema'

class Form extends BaseFormView {
  schema = createSchema()

  names = {
    singular: 'party',
    plural: 'parties',
    displayName: 'Party'
  }

  apiUrl = '/api/parties'

  renderFields() {
    const { data, errors } = this.state
    return (
      <>
        <FormGroup row>
          <Col md="3">
            <Label htmlFor="name">Name *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="name"
              name="name"
              onChange={this.handleChange}
              value={data.name ? data.name : ''}
              invalid={!!(errors && errors.name)}
            />
            {errors && errors.name && <FormFeedback>{errors.name}</FormFeedback>}
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="enabled">Enabled?</Label>
          </Col>
          <Col md="9">
            <FormGroup check className="checkbox">
              <Input
                className="form-check-input"
                type="checkbox"
                id="enabled"
                name="enabled"
                onChange={this.handleChange}
                checked={data.enabled}
              />
            </FormGroup>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="enabled">Colour</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="colour"
              name="colour"
              onChange={this.handleChange}
              value={data.colour ? data.colour : ''}
              invalid={!!(errors && errors.colour)}
            />
            {errors && errors.colour && <FormFeedback>{errors.colour}</FormFeedback>}
          </Col>
        </FormGroup>
      </>
    )
  }
}

export default Form
