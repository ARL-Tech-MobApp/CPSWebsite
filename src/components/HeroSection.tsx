import React from 'react';
import '../styles/main.css';

const HeroSection: React.FC = () => {
    return (
        <>
            {/* Preload carousel images */}
            <link rel="preload" href="/custom-images/custom1.jpg" as="image" />
            <link rel="preload" href="/custom-images/custom2.jpg" as="image" />
            <link rel="preload" href="/custom-images/custom3.jpg" as="image" />

            <section id="hero" className="hero custom-hero-section">
                <div
                    id="hero-carousel"
                    className="carousel custom-carousel slide carousel-fade"
                    data-bs-ride="carousel"
                    data-bs-interval="2800"
                >
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="/custom-images/custom1.jpg" alt="Smart Society Management" />
                            <div className="custom-container">
                                <h2>Smart Society Management</h2>
                                <p>
                                    Streamline daily operations with our all-in-one platform for residential societies—automated billing, visitor tracking, complaint resolution, and more.
                                </p>
                                <a href="/product" className="custom-btn">
                                    Discover More
                                </a>
                            </div>
                        </div>

                        <div className="carousel-item">
                            <img src="/custom-images/custom2.jpg" alt="Excavator Rental Services" />
                            <div className="custom-container">
                                <h2>Excavator Rental Made Easy</h2>
                                <p>
                                    Our excavator service platform connects contractors with reliable, on-demand machinery—saving time, reducing hassle, and increasing productivity.
                                </p>
                                <a href="/product#excavator" className="custom-btn">
                                    Learn More
                                </a>
                            </div>
                        </div>

                        <div className="carousel-item">
                            <img src="/custom-images/custom3.jpg" alt="Innovating for the Future" />
                            <div className="custom-container">
                                <h2>Innovating for Tomorrow</h2>
                                <p>
                                    At Chaturdha, we're building smart, scalable digital solutions that simplify lives and empower industries. Your growth is our mission.
                                </p>
                                <a href="/about" className="custom-btn">
                                    About Us
                                </a>
                            </div>
                        </div>
                    </div>

                    <ul className="carousel-indicators">
                        <li data-bs-target="#hero-carousel" data-bs-slide-to="0" className="active"></li>
                        <li data-bs-target="#hero-carousel" data-bs-slide-to="1"></li>
                        <li data-bs-target="#hero-carousel" data-bs-slide-to="2"></li>
                    </ul>
                </div>
            </section>
        </>
    );
};

export default HeroSection;
