import React, { Component } from 'react'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormFeedback,
  Input,
  Label,
  Row
} from 'reactstrap'
import createSchema from '../../../../server/services/administrator/schema'

class New extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      errors: {},
      error: null,
      success: null
    }

    this.schema = createSchema()
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  handleReset() {
    this.setState({
      data: {},
      errors: {},
      error: null,
      success: null
    })
  }

  handleChange(e) {
    const { name, value, checked } = e.target
    const type = e.target.getAttribute('type')
    this.setState(({ data }) => ({
      data: {
        ...data,
        [name]: type === 'checkbox' ? checked : value
      }
    }))
  }

  handleSubmit() {
    this.setState({
      errors: {},
      error: null,
      success: null
    })

    this.validate(this.state.data, (valid, errors) => {
      if (!valid) return this.setState({ errors })

      fetch('/api/administrators/new',
        {
          method: 'POST',
          body: JSON.stringify(this.state.data),
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => res.json())
        .then((data) => {
          if (data.errors) {
            // Validation errors, display them
            return this.setState({
              errors: data.errors
            })
          }
          this.setState({ success: 'Administrator saved successfully!' })
        })
        .catch((error) => {
          console.error(error)
          this.setState({ error: 'There was an error saving, please try again later.' })
        })
    })
  }

  validate(data, callback) {
    this.schema.validate(data, (error, errors) => {
      if (error) return console.error('Error validating', error)
      callback(!Object.keys(errors).length, errors)
    })
  }

  render() {
    const { data, errors, error, success } = this.state
    return (
      <div className="animated fadeIn">
        {error && (
          <Alert color="danger">
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="success">
            {success}
          </Alert>
        )}
        <Card>
          <CardHeader>Administrator Details</CardHeader>
          <CardBody>
            <Form
              action=""
              method="post"
              encType="multipart/form-data"
              className="form-horizontal"
            >
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
                    defaultValue={data.firstName}
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
                    defaultValue={data.lastName}
                    invalid={!!(errors && errors.lastName)}
                  />
                  {errors && errors.lastName && <FormFeedback>{errors.lastName}</FormFeedback>}
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
                    defaultValue={data.emailAddress}
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
                  >
                    <option> -- Please select --</option>
                    <option value="root" checked={data.role === 'root'}>Root</option>
                    <option value="staff" checked={data.role === 'staff'}>Staff</option>
                    <option value="auditor" checked={data.role === 'auditor'}>Auditor</option>
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
            </Form>
          </CardBody>
          <CardFooter>
            <Row>
              <Col xs="2">
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
              <Col xs="2">
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

export default New
