import React from "react";
import AboutSection from '../components/AboutSection';
import Header from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => {
    return (
        <>
            <Header />
            <AboutSection />

            {/* Our Team Section */}
            <section className="container py-5 bg-light border-top" id="team">
                <h2 className="text-center fw-bold mb-4" data-aos="fade-up">Meet Our Team</h2>
                <p className="text-center text-muted mb-5" data-aos="fade-up" data-aos-delay="200">
                    A passionate collective of engineers, designers, and storytellers dedicated to pushing boundaries and creating magic in every product we build.
                </p>

                <div className="row g-4">
                    {[
                        { name: "Sibasis Sahu", role: "Managing Director", img: "/team/SibasisSir.png" },
                        { name: "Binoy Acharya", role: "Managing Director", img: "/team/BinoyAcharyaSir.png" },
                        { name: "Birendra Pradhan", role: "General Manager", img: "/team/BirenSir.png" },
                        // { name: "Mira Verma", role: "UX Researcher", img: "/testimonial/profile1.jpg" },
                        // { name: "Rahul Jain", role: "DevOps Engineer", img: "/testimonial/profile2.jpg" },
                        // { name: "Sneha Das", role: "Frontend Developer", img: "/testimonial/profile2.jpg" },
                    ].map((member, idx) => (
                        <div className="col-sm-12 col-md-6 col-lg-4" key={idx} data-aos="zoom-in" data-aos-delay={idx * 100}>
                            <div className="card border-0 shadow text-center h-100">
                                <img
                                    src={member.img}
                                    className="card-img-top rounded-top object-fit-cover"
                                    alt={member.name}
                                    style={{
                                        height: "300px",
                                        objectFit: idx < 3 ? "contain" : "cover",  // Apply "contain" to the first 3 images, else "cover"
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="fw-bold">{member.name}</h5>
                                    <p className="text-muted mb-0">{member.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </section>


            <section className="container py-5" style={{ background: "#fff" }}>
                <h2 className="text-center fw-bold mb-4" data-aos="fade-up">About Our Company</h2>
                <p className="text-center mb-5 text-muted" data-aos="fade-up" data-aos-delay="200">
                    Founded in the heart of innovation, our product-based company blends design, technology, and user empathy to craft magical solutions.
                    With a sprinkle of fantasy and a foundation of real-world efficiency, we deliver tools that feel like they’re straight out of a sci-fi novel.
                </p>

                <div className="row g-4">
                    <div className="col-md-4" data-aos="flip-left">
                        <div className="card border-0 shadow h-100">
                            <img src="/about/vision.jpg" alt="Vision" className="card-img-top rounded-top" />
                            <div className="card-body text-center">
                                <h4 className="fw-bold">Vision-Driven Development</h4>
                                <p className="text-muted">We're on a mission to shape the future of digital experiences through products that are not only smart but soulful.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4" data-aos="flip-up">
                        <div className="card border-0 shadow h-100">
                            <img src="/about/userCentric.jpg" alt="Skills & Stack" className="card-img-top rounded-top" />
                            <div className="card-body text-center">
                                <h4 className="fw-bold">User-Centric Design</h4>
                                <p className="text-muted">At the heart of everything we build is the user—every pixel, interaction, and feature is shaped with deep empathy and simplicity in mind.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4" data-aos="flip-right">
                        <div className="card border-0 shadow h-100">
                            <img src="/custom-images/custom3.jpg" alt="Core Values" className="card-img-top rounded-top" />
                            <div className="card-body text-center">
                                <h4 className="fw-bold">Our Philosophy</h4>
                                <p className="text-muted">We believe simplicity is the ultimate sophistication. Every product we craft is designed to make life easier, smarter, and just a little more magical.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mt-5">
                    <div className="col-md-6" data-aos="fade-right">
                        <div className="card border-0 shadow h-100">
                            <img src="/about/why.jpg" alt="Vision" className="card-img-top rounded-top" />
                            <div className="card-body">
                                <h4 className="fw-bold text-center">Why We Build</h4>
                                <p className="text-muted text-center">
                                    We create because we care. From simplifying society living to transforming heavy equipment logistics,
                                    our purpose is to empower people through great products.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6" data-aos="fade-left">
                        <div className="card border-0 shadow h-100">
                            <img src="/about/future.jpg" alt="Fantasy" className="card-img-top rounded-top" />
                            <div className="card-body">
                                <h4 className="fw-bold text-center">Vision for the Future</h4>
                                <p className="text-muted text-center">

                                    Our journey has just begun. With innovation as our compass, we aim to expand into new verticals and reimagine digital interactions across industries.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-5" data-aos="zoom-in">
                    <img src="/about/growth.jpg" alt="Our Journey" className="img-fluid mb-4 rounded-circle shadow" style={{ width: '120px', height: '120px' }} />
                    <h5 className="fw-semibold mb-3">Let’s Simplify the Future.....</h5>
                    <p className="text-muted">We’re building not just products—but experiences. Join us as we continue to blend utility, creativity, and compassion in everything we create.</p>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default AboutPage;
