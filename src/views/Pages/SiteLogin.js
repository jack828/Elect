import React from 'react'
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
import { connect } from 'react-redux'
import { changeLogin, login } from './auth/actions'

const SiteLogin = ({
  errors,
  login: loginData,
  authenticated,
  onChange,
  onLogin,
  websocket,
  history
}) => {
  if (authenticated) {
    return null
  }

  return (
    <div className="app-body flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="p-4 text-center">
              {/* TODO: This is styled TERRIBLY */}
              <CardBody>
                <Button
                  color="secondary"
                  onClick={() => history.push('/register')}
                >
                  <h3>Register Here</h3>
                </Button>
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault()
                      onLogin(websocket)
                    }}
                  >
                    <h1>Elect Site Login</h1>
                    {Object.keys(errors).length > 0 && (
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
                        onChange={onChange}
                        defaultValue={loginData.identity}
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
                        onChange={onChange}
                        defaultValue={loginData.password}
                      />
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button
                          color="primary"
                          className="px-4"
                          type="submit"
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

SiteLogin.defaultProps = {
  errors: {}
}

SiteLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  websocket: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,

  login: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  errors: PropTypes.object
}

const mapDispatchToProps = dispatch => ({
  onLogin: websocket => dispatch(login(websocket)),
  onChange: e => dispatch(
    changeLogin({
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
)(SiteLogin)
