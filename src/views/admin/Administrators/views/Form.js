import React from 'react'
import {
  Col,
  FormGroup,
  FormFeedback,
  Input,
  Label
} from 'reactstrap'
import BaseFormView from '../../../lib/base-form-view'
import createSchema from '../../../../../server/services/administrator/schema'

class Form extends BaseFormView {
  schema = createSchema()

  names = {
    singular: 'administrator',
    plural: 'administrators',
    displayName: 'Administrator'
  }

  apiUrl = '/api/administrators'

  renderFields() {
    const { data, errors } = this.state
    return (
      <>
        <FormGroup row>
          <Col md="3">
            <Label htmlFor="firstName">First Name *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="firstName"
              name="firstName"
              onChange={this.handleChange}
              value={data.firstName ? data.firstName : ''}
              invalid={!!(errors && errors.firstName)}
            />
            {errors && errors.firstName && <FormFeedback>{errors.firstName}</FormFeedback>}
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="lastName">Last Name *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="lastName"
              name="lastName"
              onChange={this.handleChange}
              value={data.lastName ? data.lastName : ''}
              invalid={!!(errors && errors.lastName)}
            />
            {errors && errors.lastName
              && <FormFeedback>{errors.lastName}</FormFeedback>
            }
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="email">Email Address *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="email"
              id="emailAddress"
              name="emailAddress"
              onChange={this.handleChange}
              value={data.emailAddress ? data.emailAddress : ''}
              invalid={!!(errors && errors.emailAddress)}
            />
            {errors && errors.emailAddress
              && <FormFeedback>{errors.emailAddress}</FormFeedback>
            }
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="role">Role</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="select"
              name="role"
              id="role"
              onChange={this.handleChange}
              value={data.role}
            >
              <option> -- Please select --</option>
              <option value="root">Root</option>
              <option value="staff">Staff</option>
              <option value="auditor">Auditor</option>
            </Input>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label>Enabled?</Label>
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
      </>
    )
  }
}

export default Form
