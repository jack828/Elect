import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Form
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

  handleSubmit({ close = false } = {}) {
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

          this.props.history.replace(`/admin/${this.names.plural}/${close ? 'list' : data._id}`)
        })
        .catch((error) => {
          // TODO
          console.error(error)
          this.setState({ error: 'There was an error saving, please try again later.' })
        })
    })
  }

  validate(data, callback) {
    this.schema.validate(data, (error, errors) => {
      // TODO
      if (error) return console.error('Error validating', error)
      callback(!Object.keys(errors).length, errors)
    })
  }

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
            <Button
              className="float-right ml-2"
              size="sm"
              color="secondary"
              onClick={() => this.handleSubmit({ close: true })}
            >
              Save &amp; close
            </Button>
            <Button
              className="float-right"
              size="sm"
              color="primary"
              onClick={() => this.handleSubmit()}
            >
              Save
            </Button>
          </CardHeader>
          <CardBody>
            <Form className="form-horizontal">
              {this.renderFields()}
            </Form>
          </CardBody>
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
  }).isRequired,
  history: PropTypes.object.isRequired
}

BaseFormView.defaultProps = {
}

export default BaseFormView
