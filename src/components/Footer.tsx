import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Footer: React.FC = () => {
  const { accessToken } = useAuthStore();
  return (
    <footer
      id="footer"
      className="footer bg-dark text-white"
      style={{ paddingBottom: "10px" }}
    >
      <Container className="footer-top">
        <Row className="gy-4">
          {/* About Section */}
          <Col lg={4} md={6} className="footer-about">
            <Link
              to="/"
              className="logo d-flex align-items-center text-white text-decoration-none"
            >
              <h1 className="site-name m-0  fw-bold">CPS Pvt Ltd</h1>
            </Link>
            <div className="footer-contact pt-3">
              <p>
                Block - N5/123, 3rd floor, Radhamani Building, Jaydev Vihar Rd
                (Near Biju Pattnaik College)
              </p>
              <p>Bhubaneswar, Odisha 751013</p>
              <p className="mt-3">
                <strong>Call:</strong> <span>1800-532-6114</span>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span>support@chaturdhaprojectsandservices.com</span>
              </p>
            </div>
            <div className="social-links d-flex mt-4 gap-3">
              <a href="https://x.com/bhawancare">
                <i className="bi bi-twitter-x text-white"></i>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61566381572393&sk=about">
                <i className="bi bi-facebook text-white"></i>
              </a>
              <a href="https://www.instagram.com/bhawancare/">
                <i className="bi bi-instagram text-white"></i>
              </a>
              <a href="https://www.linkedin.com/company/104807752/admin/page-posts/published/">
                <i className="bi bi-linkedin text-white"></i>
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={3} className="footer-links">
            <h4>Quick Links</h4>
            <ul className="list-unstyled">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">Who We Are</Link>
              </li>
              <li>
                <Link to="/product">Products</Link>
              </li>
              <li>
                <Link to="/contact">Support</Link>
              </li>
              <li>
                <Link to="/terms">Legal</Link>
              </li>
            </ul>
          </Col>

          {/* Services / Downloads */}
          <Col lg={2} md={3} className="footer-links">
            <h4>Download Links</h4>
            <ul className="list-unstyled">
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.bhawancare.bhawancare"
                  target="_blank"
                  rel="noreferrer"
                >
                  BhawanCare PlayStore
                </a>
              </li>
              <li>
                <Link to="/coming-soon">Excavator PlayStore</Link>
              </li>
              <li>
                <a
                  href="https://apps.apple.com/app/idYOUR_APPLE_ID"
                  target="_blank"
                  rel="noreferrer"
                >
                  BhawanCare AppStore
                </a>
              </li>
              <li>
                <Link to="/coming-soon">Excavator AppStore</Link>
              </li>
            </ul>
          </Col>

          {/* Contact Button */}
          <Col lg={4} md={12} className="footer-newsletter">
            <h4>Stay Connected</h4>
            <p>Have a question or want to get in touch with us directly?</p>
            <div className="d-flex gap-2 flex-wrap mt-3">
              <Link to="/contact">
                <Button variant="primary" className="mt-3">
                  Contact Us
                </Button>
              </Link>
              {/* {!accessToken && ( */}
              <Link to="/employee-portals">
                <Button variant="primary" className="mt-3">
                  Employee LogIn
                </Button>
              </Link>
              {/* )} */}
            </div>
            <div className="d-flex gap-2 flex-wrap mt-3">
              <a
                href="https://bhawancare.com/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Visit BhawanCare Website
              </a>
              <a
                href="https://excavatorv1.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Visit Excavator Website
              </a>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="text-center mt-4">
        <p className="copyright">
          &copy; {new Date().getFullYear()}{" "}
          <strong className="site">
            Chaturdha Projects & Services Pvt Ltd
          </strong>
          . All rights reserved.
        </p>
        <p className="credits">Designed by CPS Team</p>
      </Container>
    </footer>
  );
};

export default Footer;
