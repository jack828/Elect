import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
      error: null
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState(({ data }) => ({
      data: {
        ...data,
        [name]: value
      }
    }))
  }

  handleSubmit(e) {
    e.preventDefault()
    const { identity, password } = this.state.data
    const error = msg => this.setState({ error: msg || 'Wrong email or password combination.' })

    fetch(
      '/api/login',
      {
        method: 'POST',
        body: JSON.stringify({ identity, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => res.json())
      .then((data) => {
        if (data.error) return error(data.error)
        if (data.key) {
          window.localStorage.setItem('apiKey', data.key)
          window.localStorage.setItem('apiId', data._id)
          window.localStorage.setItem('aclRoles', data.roles)
          window.localStorage.setItem('firstName', data.firstName)
          this.props.history.push('/admin')
          return
        }
        // anything else
        error()
      })
      .catch(error)
  }

  render() {
    const { data, error } = this.state
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <h1>Elect Administrator Login</h1>
                      {error && (
                        <Alert color="danger">
                          Incorrect email address or password combination. Please try again.
                        </Alert>
                      )}
                      <p className="text-muted">Sign in to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="identity"
                          placeholder="Email Address"
                          autoComplete="email"
                          onChange={this.handleChange}
                          defaultValue={data.identity}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          name="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          onChange={this.handleChange}
                          defaultValue={data.password}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={this.handleSubmit}
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

export default Login
