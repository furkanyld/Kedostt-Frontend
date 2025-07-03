import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import "../Styles/style.css";
import logo from "../Assets/logo.png";

function MainNavbar() {
  const { user, logout, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false); // 👈 menü durumu

  // Sayfa değiştiğinde menüyü kapat
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  return (
    <Navbar
      expand="lg"
      className="transparent-navbar sticky-top"
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={logo} alt="Kedostt Logo" className="me-2" />
          Kedostt
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" onClick={() => setExpanded(false)}> {/* 👈 Menüden bir şey seçilince kapansın */}
            <Nav.Link as={Link} to="/">Ana Sayfa</Nav.Link>
            <Nav.Link as={Link} to="/donate">Sahiplen / Bağış Yap</Nav.Link>
          </Nav>
          <Nav className="ms-auto" onClick={() => setExpanded(false)}>
            {!isLoading && !user && (
              <>
                <Nav.Link as={Link} to="/login">Giriş Yap</Nav.Link>
                <Nav.Link as={Link} to="/signin">Kayıt Ol</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/profile">Profilim</Nav.Link>
                {!isLoading && isAdmin && (
                  <Nav.Link as={Link} to="/admin">Admin Panel</Nav.Link>
                )}
                <Nav.Link onClick={logout}>Çıkış Yap</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
