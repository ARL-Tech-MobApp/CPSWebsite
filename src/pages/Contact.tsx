import React from "react";
import Header from "../components/Navbar";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Header />
      <section className="contact-page py-5" data-aos="fade-up">
        <div className="container text-center">
          <h1 className="text-center fw-bold mb-2 text-blue" data-aos="fade-down">
            Get in Touch
          </h1>
          <p className="text-muted mb-3 w-75 mx-auto" data-aos="fade-up" data-aos-delay="100">
            We'd love to hear from you! Whether you have a question about features, pricing, or anything else—our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      <section className="contact-page pb-5">
        <div className="container">
          <div className="row g-4 align-items-stretch mt-4">
            {/* Left Side: Contact Info + Map */}
            <div className="col-lg-6 d-flex" data-aos="fade-right">
              <div className="contact-info glass-card p-5 shadow rounded-4 w-100 d-flex flex-column justify-content-between">
                <div>
                  <h3 className="fw-bold text-primary mb-4">Contact Information</h3>
                  <p><strong> Address:</strong> Block - N5/123, 3rd floor, Radhamani Building, Jaydev Vihar Rd (Near Biju Pattnaik College), Bhubaneswar, Odisha 751013</p>
                  <p><strong> Phone:</strong> <a href="tel: 1800-532-6114" className="text-decoration-none text-dark">1800-532-6114</a></p>
                  <p><strong> Email:</strong> <a href="mailto:support@chaturdhaprojectsandservices.com" className="text-decoration-none text-dark">support@chaturdhaprojectsandservices.com</a></p>
                </div>
                <div className="map mt-4 rounded-4 overflow-hidden shadow-sm">
                  {process.env.NODE_ENV === 'production' && (
                    <iframe
                      title="Google Maps"
                      src="..."
                      width="100%"
                      height={300}
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                  )}

                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="col-lg-6 d-flex" data-aos="fade-left">
              <div className="glass-card p-5 shadow rounded-4 w-100 d-flex flex-column justify-content-between">
                <div>
                  <h3 className="fw-bold text-primary mb-4">Send Us a Message</h3>
                  <form
                    action="https://formsubmit.co/support@chaturdhaprojectsandservices.com"
                    method="POST"
                    className="d-flex flex-column gap-3"
                  >
                    <input type="hidden" name="_captcha" value="false" />
                    <div>
                      <label className="form-label">Name</label>
                      <input type="text" name="name" className="form-control rounded-3" placeholder="Your full name" required />
                    </div>
                    <div>
                      <label className="form-label">Email</label>
                      <input type="email" name="email" className="form-control rounded-3" placeholder="you@example.com" required />
                    </div>
                    <div>
                      <label className="form-label">Subject</label>
                      <input type="text" name="subject" className="form-control rounded-3" placeholder="Subject of your message" />
                    </div>
                    <div>
                      <label className="form-label">Message</label>
                      <textarea name="message" className="form-control rounded-3" rows={5} placeholder="Type your message here..." required></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary px-4 mt-2 align-self-start">
                      Send Message
                    </button>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
