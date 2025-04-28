import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="sticky-top bg-white shadow-sm">
      <Navbar expand="lg" className="py-3">
        <Container fluid className="px-3"> {/* Use fluid and controlled padding */}
          <div className="d-flex w-100 justify-content-between align-items-center flex-nowrap">
            <Navbar.Brand
              as={Link}
              to="/"
              className="d-flex align-items-center gap-2 flex-nowrap overflow-hidden"
            >
              <img
                src="/download/logo.png"
                alt="Chaturdha Logo"
                height={60}
                width={60}
                className="d-inline-block"
                style={{ objectFit: 'contain' }}
              />
              <div className="d-flex flex-column justify-content-center">
                <h1 className="sitename m-0  fw-bold">CPS Pvt Ltd</h1>
                <h2 className="sitename-sub m-0 fw-semibold"> <span className="text-primary">.</span></h2>
              </div>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="main-navbar-nav" />
          </div>

          <Navbar.Collapse id="main-navbar-nav" className="mt-3 mt-lg-0">
            <Nav className="ms-auto text-uppercase fw-semibold fs-6 gap-3">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              <Nav.Link as={Link} to="/product">Products</Nav.Link>
              <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </header>
  );
};

export default Header;
