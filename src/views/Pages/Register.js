import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'
import { connect } from 'react-redux'

import { change, register } from './auth/actions'

// eslint-disable-next-line
class Register extends Component {
  render() {
    const {
      errors,
      data,
      authenticated,
      onChange,
      onRegister,
      websocket,
      history
    } = this.props

    if (authenticated) {
      return history.push('/')
    }
    return (
      <div className="app-body flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              {Object.keys(errors).length > 0 && (
                <Alert color="danger">Whoops, something isn&apos;t right!</Alert>
              )}
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault()
                      onRegister(websocket)
                    }}
                  >
                    <h1>Elect Register</h1>
                    <p className="text-muted">Create your account</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        onChange={onChange}
                        defaultValue={data.firstName}
                        invalid={!!errors.firstName}
                      />
                      {errors.firstName && (
                        <FormFeedback>{errors.firstName}</FormFeedback>
                      )}
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={onChange}
                        defaultValue={data.lastName}
                        invalid={!!errors.lastName}
                      />
                      {errors.lastName && (
                        <FormFeedback>{errors.lastName}</FormFeedback>
                      )}
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Email"
                        name="emailAddress"
                        onChange={onChange}
                        defaultValue={data.emailAddress}
                        invalid={!!errors.emailAddress}
                      />
                      {errors.emailAddress && (
                        <FormFeedback>{errors.emailAddress}</FormFeedback>
                      )}
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={onChange}
                        defaultValue={data.password}
                        invalid={!!errors.password}
                      />
                      {errors.password && (
                        <FormFeedback>{errors.password}</FormFeedback>
                      )}
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Repeat Password"
                        name="passwordConfirm"
                        onChange={onChange}
                        defaultValue={data.passwordConfirm}
                        invalid={!!errors.passwordConfirm}
                      />
                      {errors.passwordConfirm && (
                        <FormFeedback>{errors.passwordConfirm}</FormFeedback>
                      )}
                    </InputGroup>

                    <Button
                      color="success"
                      block
                      disabled={Object.keys(errors).length > 0}
                    >
                      Create Account
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

Register.defaultProps = {
  errors: {}
}

Register.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  websocket: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,


  data: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  errors: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  onRegister: websocket => dispatch(register(websocket)),
  onChange: e => dispatch(
    change({
      [e.currentTarget.name]:
        e.currentTarget.type === 'checkbox'
          ? e.currentTarget.checked
          : e.currentTarget.value
    })
  )
})

export default connect(
  ({ auth }) => auth.toJS(),
  mapDispatchToProps
)(Register)
