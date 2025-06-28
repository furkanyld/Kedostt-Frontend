import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import '../Styles/style.css';
import logo from '../Assets/logo.png';

function MainNavbar() {
  return (
      <Navbar expand="lg" className="transparent-navbar sticky-top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Kedostt Logo"
            className="me-2" // logo ile yazı arasına boşluk bırakır
          />
          Kedostt</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Ana Sayfa</Nav.Link>
              <Nav.Link as={Link} to="/adopt">Sahiplen</Nav.Link>
              <Nav.Link as={Link} to="/donate">Bağış Yap</Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">Giriş Yap</Nav.Link>
              <Nav.Link as={Link} to="/signin">Kayıt Ol</Nav.Link>
          </Nav> 
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default MainNavbar;
