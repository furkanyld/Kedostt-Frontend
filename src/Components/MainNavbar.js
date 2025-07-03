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
          <span className="navbar-title">Kedostt</span>
          {/* Mobilde navbarda "Sahiplen / Bağış Yap" görünür */}
          <Link
            to="/donate"
            className="d-lg-none ms-2 text-decoration-none navbar-title"
            style={{ fontSize: "0.9rem" }}
          >
            Sahiplen / Bağış Yap
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-auto" onClick={() => setExpanded(false)}>
            <Nav.Link as={Link} to="/">Ana Sayfa</Nav.Link>
            <Nav.Link as={Link} to="/donate">Sahiplen / Bağış Yap</Nav.Link>
          </Nav>
          <Nav className="ms-auto" onClick={() => setExpanded(false)}>
            {!isLoading && (
              <>
                {!user && (
                  <>
                    <Nav.Link as={Link} to="/login" className="navbar-title">Giriş Yap</Nav.Link>
                    <Nav.Link as={Link} to="/signin" className="navbar-title">Kayıt Ol</Nav.Link>
                  </>
                )}
                {user && (
                  <>
                    <Nav.Link as={Link} to="/profile" className="navbar-title">Profilim</Nav.Link>
                    {isAdmin && (
                      <Nav.Link as={Link} to="/admin" className="navbar-title">Admin Panel</Nav.Link>
                    )}
                    <Nav.Link onClick={logout} className="navbar-title">Çıkış Yap</Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
