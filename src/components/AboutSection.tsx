import { FaCheckCircle } from "react-icons/fa";
import StatsSection from "./StatsSection";

const AboutSection = () => {
    return (
        <section className="container py-5 mt-5" id="about">
            <div className="row d-flex flex-column-reverse flex-md-row align-items-center">
                {/* Text Content */}
                <div
                    className="col-md-6 mt-4 mt-md-0"
                    data-aos="fade-left"
                >
                    <h2 className="mb-3 fw-bold">Driven by Innovation, Built for Impact</h2>
                    <p className="mb-3 text-muted">
                        At Chaturdha Projects & Services Pvt Ltd, we specialize in building purpose-driven digital products designed to solve real-world challenges.
                    </p>
                    <p className="mb-4 text-muted">
                        Our flagship platforms — a modern <strong>Society Management System</strong> and a robust <strong>Excavator Service Management solution</strong> — are tailored to improve operational efficiency, transparency, and user experience across sectors.
                    </p>
                    <ul className="list-unstyled mb-4">
                        {[
                            "Scalable and secure product architecture",
                            "Seamless user experiences for web and mobile",
                            "Field-tested by real users and industry experts",
                            "Ongoing feature updates based on customer feedback",
                        ].map((item, index) => (
                            <li key={index} className="mb-3 d-flex align-items-center">
                                {FaCheckCircle({ className: "text-success me-2" })}
                                {item}
                            </li>
                        ))}
                    </ul>

                    <h5 className="fw-semibold mb-3">Why Choose Chaturdha?</h5>
                    <ul className="list-unstyled">
                        {[
                            "Domain expertise in civil and tech integration",
                            "Product-first approach with agile delivery",
                            "Committed support and customer satisfaction",
                        ].map((item, i) => (
                            <li key={i} className="mb-2 d-flex align-items-center">
                                {FaCheckCircle({ className: "text-success me-2" })}
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Image */}
                <div
                    className="col-md-6 mb-4 mb-md-0"
                    data-aos="fade-right"
                >
                    <div className="about-img-wrapper shadow rounded overflow-hidden w-100">
                        <img
                            src="/custom-images/custom1.jpg"
                            alt="About"
                            className="img-fluid w-100"
                            style={{
                                height: "100%",
                                maxHeight: "500px",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                </div>
            </div>
            <StatsSection />
        </section>
    );
};

export default AboutSection;
