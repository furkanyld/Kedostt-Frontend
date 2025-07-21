import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import "../Styles/style.css";
import logo from "../Assets/logo.png";

function MainNavbar() {
  const { user, logout, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);

  // 🌙 Dark mode toggle state
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("kedostt-darkmode") === "true"
  );

  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("kedostt-darkmode", isDarkMode);
  }, [isDarkMode]);

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
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="me-auto" onClick={() => setExpanded(false)}>
            <Nav.Link as={Link} to="/">Ana Sayfa</Nav.Link>
            <Nav.Link as={Link} to="/donate">Sahiplen / Bağış Yap</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <div className="ms-auto d-flex align-items-center me-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="btn btn-sm btn-outline-dark"
              >
                {isDarkMode ? "🌞" : "🌙"}
              </button>
            </div>
            <Nav className="ms-auto" onClick={() => setExpanded(false)}>
              {!isLoading && (
                <>
                  {!user ? (
                    <>
                      <Nav.Link as={Link} to="/login" className="navbar-title">Giriş Yap</Nav.Link>
                      <Nav.Link as={Link} to="/signin" className="navbar-title">Kayıt Ol</Nav.Link>
                    </>
                  ) : (
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
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;
