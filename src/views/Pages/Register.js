import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'
import { connect } from 'react-redux'

import { change, onRegister } from './auth/actions'

// eslint-disable-next-line
class Register extends Component {
  render() {
    console.log(this.props)
    return (
      <div className="app-body flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              {this.props.error && (
                <h1>error</h1>
              )}
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault()
                      this.props.onRegister(this.props.websocket)
                    }}
                  >
                    <h1>Register</h1>
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
                        onChange={this.props.onChange}
                        defaultValue={this.props.data.firstName}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        placeholder="Email"
                        name="email"
                        onChange={this.props.onChange}
                        defaultValue={this.props.data.email}
                      />
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
                        onChange={this.props.onChange}
                        defaultValue={this.props.data.password}
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
                        placeholder="Repeat Password"
                        name="passwordConfirm"
                        onChange={this.props.onChange}
                        defaultValue={this.props.data.passwordconfirm}
                      />
                    </InputGroup>
                    <Button color="success" block>Create Account</Button>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook mb-1" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter mb-1" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

Register.defaultProps = {
  error: null
  // errorProperties: {}
}

Register.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  websocket: PropTypes.object.isRequired,


  data: PropTypes.object.isRequired,
  error: PropTypes.string
  // errorProperties: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  onRegister: websocket => dispatch(onRegister(websocket)),
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
