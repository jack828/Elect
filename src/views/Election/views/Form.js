import React from 'react'
import {
  Col,
  FormGroup,
  FormFeedback,
  FormText,
  Input,
  Label
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import Multiselect from '../../lib/MultiSelect'
import BaseFormView from '../../lib/base-form-view'
import createSchema from '../../../../server/services/election/schema'

class Form extends BaseFormView {
  // TODO: fields should not be editible if the visible date has passed
  schema = createSchema()

  names = {
    singular: 'election',
    plural: 'elections',
    displayName: 'Election'
  }

  apiUrl = '/api/elections'

  handleDateChange(field, date) {
    this.setState(({ data }) => ({
      data: {
        ...data,
        [field]: date
      }
    }))
  }

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
            <Label htmlFor="parties">Parties *</Label>
          </Col>
          <Col xs="12" md="9">
            <Multiselect
              id="parties"
              name="parties"
              apiUrl="/api/parties"
              onChange={this.handleChange}
              value={data.parties ? data.parties : []}
              invalid={!!(errors && errors.name)}
            />
            {errors && errors.parties && <FormFeedback>{errors.parties}</FormFeedback>}
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="visibleFrom">Visible From *</Label>
          </Col>
          <Col xs="12" md="9">
            <DatePicker
              customInput={<Input invalid={!!(errors && errors.visibleFrom)} />}
              name="visibleFrom"
              dateFormat="do MMMM YYYY HH:MM"
              selected={data.visibleFrom ? data.visibleFrom : null}
              onChange={date => this.handleDateChange('visibleFrom', date)}
              showTimeSelect
            />
            {errors && errors.visibleFrom && <FormFeedback>{errors.visibleFrom}</FormFeedback>}
            <FormText className="help-block">
              This is the date the election will be visible from. It must not overlap.
            </FormText>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="visibleTo">Visible To *</Label>
          </Col>
          <Col xs="12" md="9">
            <DatePicker
              customInput={<Input invalid={!!(errors && errors.visibleTo)} />}
              name="visibleTo"
              dateFormat="do MMMM YYYY HH:MM"
              selected={data.visibleTo ? data.visibleTo : null}
              onChange={date => this.handleDateChange('visibleTo', date)}
              showTimeSelect
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
            <Label htmlFor="voteOpenFrom">Vote Open From *</Label>
          </Col>
          <Col xs="12" md="9">
            <DatePicker
              customInput={<Input invalid={!!(errors && errors.voteOpenFrom)} />}
              name="voteOpenFrom"
              dateFormat="do MMMM YYYY HH:MM"
              selected={data.voteOpenFrom ? data.voteOpenFrom : null}
              onChange={date => this.handleDateChange('voteOpenFrom', date)}
              showTimeSelect
            />
            {errors && errors.voteOpenFrom && <FormFeedback>{errors.voteOpenFrom}</FormFeedback>}
            <FormText className="help-block">
              This is the date voting will be available from. It must not overlap.
            </FormText>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col md="3">
            <Label htmlFor="voteOpenTo">Vote Open To *</Label>
          </Col>
          <Col xs="12" md="9">
            <DatePicker
              customInput={<Input invalid={!!(errors && errors.voteOpenTo)} />}
              name="voteOpenTo"
              dateFormat="do MMMM YYYY HH:MM"
              selected={data.voteOpenTo ? data.voteOpenTo : null}
              onChange={date => this.handleDateChange('voteOpenTo', date)}
              showTimeSelect
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
