import React from 'react'
import {
  Col,
  FormGroup,
  Input,
  Label
} from 'reactstrap'

import BaseFilterView from '../../../lib/base-filter-view'

class FilterView extends BaseFilterView {
  renderFields() {
    const { filter, keywords } = this.state
    return (
      <>
        <FormGroup row>
          <Col xs="12">
            <Label htmlFor="keywords">Keywords</Label>
          </Col>
          <Col xs="12">
            <Input
              type="text"
              id="keywords"
              name="keywords"
              onChange={this.handleChangeKeywords}
              defaultValue={keywords || ''}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col xs="12">
            <Label>Enabled?</Label>
          </Col>
          <Col xs="12">
            <FormGroup check className="checkbox">
              <Input
                className="form-check-input"
                type="checkbox"
                id="enabled"
                name="enabled"
                onChange={this.handleChange}
                checked={filter.enabled}
              />
            </FormGroup>
          </Col>
        </FormGroup>
      </>
    )
  }
}

export default FilterView
