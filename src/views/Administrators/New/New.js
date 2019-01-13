import React, { Component } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from 'reactstrap'

class New extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="animated fadeIn">
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
                  <Label htmlFor="firstName">First Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="lastName">Last Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email">Email Address</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="email"
                    id="email"
                    name="email"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email-input">Email Input</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input
                    type="email"
                    id="email-input"
                    name="email-input"
                    placeholder="Enter Email"
                    autoComplete="email"
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="role">Role</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="role" id="role">
                    <option> -- Please select --</option>
                    <option value="root">Root</option>
                    <option value="staff">Staff</option>
                    <option value="auditor">Auditor</option>
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
                    />
                  </FormGroup>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
          <CardFooter>
            <Row>
              <Col xs="2">
                <Button type="submit" size="sm" color="primary">
                  <i className="fa fa-dot-circle-o" />
                  {' '}
                  Submit
                </Button>
              </Col>
              <Col xs="2">
                <Button type="reset" size="sm" color="danger">
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
