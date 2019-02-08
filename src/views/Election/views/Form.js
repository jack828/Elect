import React from 'react'
import {
  Col,
  FormGroup,
  FormFeedback,
  FormText,
  Input,
  Label
} from 'reactstrap'
import BaseFormView from '../../lib/base-form-view'
import createSchema from '../../../../server/services/election/schema'

class Form extends BaseFormView {
  schema = createSchema()

  names = {
    singular: 'election',
    plural: 'elections',
    displayName: 'Election'
  }

  apiUrl = '/api/elections'

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
            <Label htmlFor="name">Parties *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="name"
              name="name"
              onChange={this.handleChange}
              value={data.parties ? data.parties : ''}
              invalid={!!(errors && errors.parties)}
            />
            {errors && errors.parties && <FormFeedback>{errors.parties}</FormFeedback>}
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="name">Visible From *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="visibleFrom"
              name="visibleFrom"
              onChange={this.handleChange}
              value={data.visibleFrom ? data.visibleFrom : ''}
              invalid={!!(errors && errors.visibleFrom)}
            />
            {errors && errors.visibleFrom && <FormFeedback>{errors.visibleFrom}</FormFeedback>}
            <FormText className="help-block">
              This is the date the election will be visible from. It must not overlap.
            </FormText>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="name">Visible To *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="visibleTo"
              name="visibleTo"
              onChange={this.handleChange}
              value={data.visibleTo ? data.visibleTo : ''}
              invalid={!!(errors && errors.visibleTo)}
            />
            {errors && errors.visibleTo && <FormFeedback>{errors.visibleTo}</FormFeedback>}
            <FormText className="help-block">
              This is the date the election will
              <strong> not </strong>
              be visible from. It must not overlap.
            </FormText>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="name">Vote Open From *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="voteOpenFrom"
              name="voteOpenFrom"
              onChange={this.handleChange}
              value={data.voteOpenFrom ? data.voteOpenFrom : ''}
              invalid={!!(errors && errors.voteOpenFrom)}
            />
            {errors && errors.voteOpenFrom && <FormFeedback>{errors.voteOpenFrom}</FormFeedback>}
            <FormText className="help-block">
              This is the date voting will be available from. It must not overlap.
            </FormText>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="name">Vote Open To *</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id="voteOpenTo"
              name="voteOpenTo"
              onChange={this.handleChange}
              value={data.voteOpenTo ? data.voteOpenTo : ''}
              invalid={!!(errors && errors.voteOpenTo)}
            />
            {errors && errors.voteOpenTo && <FormFeedback>{errors.voteOpenTo}</FormFeedback>}
            <FormText className="help-block">
              This is the date voting will
              <strong> not </strong>
              be available from. It must not overlap.
            </FormText>
          </Col>
        </FormGroup>
      </>
    )
  }
}

export default Form
