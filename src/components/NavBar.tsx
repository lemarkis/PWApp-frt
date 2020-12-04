import React from 'react';
import { Button, Dropdown, Nav, Navbar, NavItem, NavLink } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPowerOff, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import './../index.scss'

const NavBar = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout
  } = useAuth0();

  const logoutWithRedirect = () => {
    logout({ returnTo: window.location.origin });
  }

  const NavConnected = () => (
    <Dropdown alignRight as={NavItem}>
      <Dropdown.Toggle id="dropdown-user" as={NavLink} variant="primary">
        <img
          src={user.picture}
          alt="Profile"
          className="nav-user-profile rounded-circle"
          width="25"
        />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Header>{user.name}</Dropdown.Header>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => logoutWithRedirect()}>
          <FontAwesomeIcon icon={faPowerOff} className="mr-3 text-danger" />Déconnexion
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )

  const NavDisconnected = () => (
    <Button variant="outline-secondary" id="qsLoginBtn" onClick={() => loginWithRedirect().then(res => console.log(res))} color="success">
      <FontAwesomeIcon icon={faSignInAlt} fixedWidth className="pr-1" />Connexion
    </Button>
  )

  return (
    <Navbar fixed="top" collapseOnSelect id="navbar" expand="sm" variant="dark" bg="primary" style={{ minHeight: 80 }}>
      <Navbar.Brand href="/">
        <img
          src="/logo.png"
          height="50"
          className="d-inline-block align-top"
          alt="What's Next"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
        </Nav>
        { isAuthenticated ? <NavConnected /> : <NavDisconnected /> }
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
