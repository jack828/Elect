import React from 'react'
import {
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Col,
  Form,
  Row
} from 'reactstrap'
import BaseComponentView from './base-component-view'

class BaseFilterView extends BaseComponentView {
  constructor(props) {
    super(props)
    this.initialState = {
      filter: {},
      sort: [ 'createdDate', 'desc' ],
      pagination: { pageSize: 50, page: 1 }
    }
    this.state = { ...this.initialState }

    this.handleChange = this.handleChange.bind(this)
    this.handleChangeKeywords = this.handleChangeKeywords.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  componentDidMount() {
    this.handleSubmit()
  }

  handleChangeKeywords(e) {
    const { value } = e.target
    this.setState({
      keywords: value.split(' ')
    })
  }

  handleChange(e) {
    const { name, value, checked } = e.target
    const type = e.target.getAttribute('type')
    this.setState(({ filter }) => ({
      filter: {
        ...filter,
        [name]: type === 'checkbox' ? checked : value
      }
    }))
  }

  handleReset() {
    this.setState(this.initialState, () => this.handleSubmit())
  }

  handleSubmit() {
    this.props.handleFilter({ ...this.state })
  }

  renderFields() {
    return <h1>TODO</h1>
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            Filter
          </CardHeader>
          <CardBody>
            <Form className="form-horizontal">
              {this.renderFields()}
            </Form>
          </CardBody>
          <CardFooter>
            <Row>
              <Col>
                <Button
                  type="submit"
                  size="sm"
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  <i className="fa fa-dot-circle-o" />
                  {' '}
                  Submit
                </Button>
              </Col>
              <Col>
                <Button
                  type="reset"
                  size="sm"
                  color="danger"
                  onClick={this.handleReset}
                >
                  <i className="fa fa-ban" />
                  {' '}
                  Reset
                </Button>
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </div>
    )
  }
}

export default BaseFilterView
