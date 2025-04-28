import React from "react";
import "../styles/main.css";
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Product = () => {
  return (
    <>
      <Header />
      <section className="product-page py-5" data-aos="fade-up">
        <div className="container text-center">
          <h1 className="fw-bold mb-2 text-blue">Our Powerful Product Line</h1>
        </div>
      </section>

      <section className="product-details py-5">
        <div className="container">
          {/* Bhawan Care */}
          <div className="row align-items-center mb-5 product-item" data-aos="fade-right">
            <div className="col-lg-6">
              <img
                src="/download/phone1.png"
                alt="Bhawan Care App"
                className="img-fluid shadow rounded-4 floating"
              />
            </div>
            <div className="col-lg-6">
              <div className="product-card glass-card border-0 shadow p-4 rounded-4 h-100">
                <h2 className="fw-bold text-primary">Bhawan Care</h2>
                <p className="text-muted">
                  Bhawan Care is your one-stop solution for all society and apartment management needs.
                  Built for residents, managers, and security staff, it ensures seamless operations and communication within gated communities.
                </p>
                <ul className="text-muted">
                  <li> Secure Visitor & Delivery Management</li>
                  <li> Notice Board, Complaint Management, & Helpdesk</li>
                  <li> Utility Bill Tracking & Automated Payments</li>
                  <li> Amenity Booking (Clubhouse, Gym, etc.)</li>
                  <li> Monthly Reports & Community Dashboard</li>
                </ul>
                <div className="mt-3 d-flex flex-wrap align-items-center gap-3">
                  <a href="https://play.google.com/" target="_blank" rel="noreferrer">
                    <img src="/download/playstore.png" alt="Google Play" className="store-btn" />
                  </a>
                  <a href="https://www.apple.com/in/app-store/" target="_blank" rel="noreferrer">
                    <img src="/download/apple-logo.png" alt="App Store" className="store-btn" />
                  </a>
                  <a
                    href="https://bhawancare.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Excavator App */}
          <div className="row align-items-center flex-lg-row-reverse mb-5 product-item" data-aos="fade-left">
            <div className="col-lg-6">
              <img
                src="/download/phone1.png"
                alt="Excavator App"
                className="img-fluid shadow rounded-4 floating"
              />
            </div>
            <div className="col-lg-6">
              <div className="product-card glass-card border-0 shadow p-4 rounded-4 h-100">
                <h2 className="fw-bold text-primary">Excavator App</h2>
                <p className="text-muted">
                  The Excavator App revolutionizes the equipment rental market by offering a smart and intuitive platform to book excavators.
                  Whether you're a contractor, builder, or an individual, get access to the right tools, on demand.
                </p>
                <ul className="text-muted">
                  <li> Real-Time Excavator Booking</li>
                  <li> GPS Tracking & Route Optimization</li>
                  <li> Verified Operators & Service Records</li>
                  <li> Transparent Pricing & Invoice System</li>
                  <li> 24/7 Customer Support & Assistance</li>
                </ul>
                <div className="mt-3 d-flex flex-wrap align-items-center gap-3">
                  <a href="https://play.google.com/" target="_blank" rel="noreferrer">
                    <img src="/download/playstore.png" alt="Google Play" className="store-btn" />
                  </a>
                  <a href="https://www.apple.com/in/app-store/" target="_blank" rel="noreferrer">
                    <img src="/download/apple-logo.png" alt="App Store" className="store-btn" />
                  </a>
                  <a
                    href="https://excavatorapp.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="section-separator"></div>

          <div className="text-center mt-5" data-aos="zoom-in">
            <h4 className="fw-bold">Crafted with care. Powered by purpose.</h4>
            <p className="text-muted w-75 mx-auto">
              Whether it’s managing a society or getting the right equipment at the right time, our products are designed to solve real-world problems
              with simplicity and elegance.
            </p>
            <Link to="/contact" className="btn btn-primary mt-3">
              Contact Us to Learn More
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Product;
