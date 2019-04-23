import React from 'react'
import PropTypes from 'prop-types'
import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'
import {
  AppNavbarBrand
} from '@coreui/react'
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'

const SiteHeader = ({ onLogout }) => (
  <>
    <AppNavbarBrand
      full={{ src: logo, width: 89, height: 25, alt: 'Elect Logo' }}
      minimized={{ src: sygnet, width: 30, height: 30, alt: 'Elect Logo' }}
    />
    <Nav className="d-md-down-none" navbar>
      <NavItem className="px-3">
        <NavLink href="/">Dashboard</NavLink>
      </NavItem>
    </Nav>
    <Nav className="ml-auto" navbar>
      <NavItem>
        <NavLink onClick={e => onLogout(e)} href="#">
          <i className="fa fa-power-off" />
        </NavLink>
      </NavItem>
    </Nav>
  </>
)

SiteHeader.propTypes = {
  onLogout: PropTypes.func.isRequired
}

export default SiteHeader
