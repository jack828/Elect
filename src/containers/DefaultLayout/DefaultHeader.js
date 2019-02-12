import React from 'react'
import PropTypes from 'prop-types'
import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'
import {
  AppAsideToggler,
  AppNavbarBrand,
  AppSidebarToggler
} from '@coreui/react'
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'

const DefaultHeader = ({ onLogout }) => (
  <>
    <AppSidebarToggler className="d-lg-none" display="md" mobile />
    <AppNavbarBrand
      full={{ src: logo, width: 89, height: 25, alt: 'Elect Logo' }}
      minimized={{ src: sygnet, width: 30, height: 30, alt: 'Elect Logo' }}
    />
    <AppSidebarToggler className="d-md-down-none" display="lg" />

    <Nav className="d-md-down-none" navbar>
      <NavItem className="px-3">
        <NavLink href="/admin">Dashboard</NavLink>
      </NavItem>
    </Nav>
    <Nav className="ml-auto" navbar>
      <NavItem className="d-md-down-none">
        <NavLink onClick={e => onLogout(e)} href="#">
          <i className="fa fa-power-off" />
        </NavLink>
      </NavItem>
    </Nav>
    <AppAsideToggler className="d-md-down-none" />
  </>
)

DefaultHeader.propTypes = {
  onLogout: PropTypes.func.isRequired
}

export default DefaultHeader
