import React from 'react';

const Testimonial = () => {
    return (
        <>
            {/* Preload testimonial images */}
            <link rel="preload" href="/testimonial/profile1.jpg" as="image" />
            <link rel="preload" href="/testimonial/profile2.jpg" as="image" />
            <link rel="preload" href="/testimonial/profile3.jpg" as="image" />

            <section className="bg-light py-5">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">What Our Users Say</h2>

                    <div id="testimonialCarousel" className="carousel slide testimonial-wrapper" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <div className="d-flex justify-content-center">
                                    <div className="card testimonial-card text-center position-relative">
                                        <div className="testimonial-img-wrapper mx-auto mt-4">
                                            <img src="/testimonial/profile2.jpg" alt="Client 1" className="testimonial-img" />
                                        </div>
                                        <div className="star-box">★★★★★</div>
                                        <h5 className="fw-bold mt-3">Samantha R.</h5>
                                        <p className="text-muted fst-italic px-3">
                                            “An absolutely magical experience. Beautiful design, seamless interface, and truly outstanding customer support.”
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="carousel-item">
                                <div className="d-flex justify-content-center">
                                    <div className="card testimonial-card text-center position-relative">
                                        <div className="testimonial-img-wrapper mx-auto mt-4">
                                            <img src="/testimonial/profile1.jpg" alt="Client 2" className="testimonial-img" />
                                        </div>
                                        <div className="star-box">★★★★★</div>
                                        <h5 className="fw-bold mt-3">Michael T.</h5>
                                        <p className="text-muted fst-italic px-3">
                                            “Their service transformed our work. Everything feels intuitive, smooth, fast, and highly reliable.”
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="carousel-item">
                                <div className="d-flex justify-content-center">
                                    <div className="card testimonial-card text-center position-relative">
                                        <div className="testimonial-img-wrapper mx-auto mt-4">
                                            <img src="/testimonial/profile3.jpg" alt="Client 3" className="testimonial-img" />
                                        </div>
                                        <div className="star-box">★★★★★</div>
                                        <h5 className="fw-bold mt-3">Ava K.</h5>
                                        <p className="text-muted fst-italic px-3">
                                            “Exceeded expectations in every way — from thoughtful design to smooth and flawless deployment.”
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Left and Right Navigation Buttons */}
                        <button className="carousel-control-prev custom-carousel-btn" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        </button>
                        <button className="carousel-control-next custom-carousel-btn" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Testimonial;
