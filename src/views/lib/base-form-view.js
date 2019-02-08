import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  Row
} from 'reactstrap'

class BaseFormView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      errors: {},
      error: null,
      success: null
    }

    this.isNew = false

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  componentDidMount() {
    // TODO this could be better
    const { match } = this.props
    const { params } = match
    const { id } = params

    if (id) {
      this.isNew = false
      fetch(`${this.apiUrl}/${id}`)
        .then(res => res.json())
        .then((data) => {
          // TODO: Handle 404
          this.setState({ data })
        })
    } else {
      this.isNew = true
    }
  }

  handleReset() {
    this.setState({
      data: this.schema.makeBlank(),
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

      fetch(`${this.apiUrl}/${this.isNew ? 'new' : this.state.data._id}`,
        {
          method: this.isNew ? 'POST' : 'PUT',
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
          this.setState({ success: `${this.names.displayName} saved successfully!` })
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

  // eslint-disable-next-line class-methods-use-this
  renderFields() {
    return <h1>Please override me</h1>
  }

  render() {
    const { error, success } = this.state
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
          <CardHeader>
            {this.names.displayName}
            {' '}
            Details
          </CardHeader>
          <CardBody>
            <Form className="form-horizontal">
              {this.renderFields()}
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

BaseFormView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
}

BaseFormView.defaultProps = {
}

export default BaseFormView
