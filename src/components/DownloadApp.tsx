import React from "react";
import { Link } from "react-router-dom"; // Import Link for routing

const Download = () => {
    return (
        <section className="download-section py-5">
            <div className="container">
                {/* First Row - Bhawan Care App */}
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <div className="app-box shadow p-5">
                            <h2 className="fw-bold mb-3">Download Our Bhawan Care App</h2>
                            <p className="text-muted mb-4">
                                Boost your daily flow with our flagship app. Stay productive,
                                connected, and creative—all in one powerful experience.
                            </p>
                            <div className="d-flex flex-wrap gap-3 align-items-center">
                                {/* Link to Coming Soon Page */}
                                <Link to="/coming-soon" className="text-decoration-none">
                                    <img src="/download/apple-logo.png" alt="App Store" className="store-badge" />
                                </Link>
                                <Link to="/coming-soon" className="text-decoration-none">
                                    <img src="/download/playstore.png" alt="Google Play" className="store-badge" />
                                </Link>
                                <img
                                    src="/download/qrcode.png"
                                    alt="QR Code"
                                    className="qr-code"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 text-center">
                        <img
                            src="/download/phone1.png"
                            alt="Main App Install"
                            className="img-fluid phone-image"
                        />
                    </div>
                </div>

                <hr className="my-5" />

                {/* Second Row - Excavator App */}
                <div className="row align-items-center flex-lg-row-reverse g-5">
                    <div className="col-lg-6">
                        <div className="app-box shadow p-5">
                            <h2 className="fw-bold mb-3">Try Our Excavator App</h2>
                            <p className="text-muted mb-4">
                                Complement your experience with our sidekick app. Designed for
                                remote access, quick tracking, and powerful on-the-go tools.
                            </p>
                            <div className="d-flex flex-wrap gap-3 align-items-center">
                                {/* Link to Coming Soon Page */}
                                <Link to="/coming-soon" className="text-decoration-none">
                                    <img src="/download/apple-logo.png" alt="App Store" className="store-badge" />
                                </Link>
                                <Link to="/coming-soon" className="text-decoration-none">
                                    <img src="/download/playstore.png" alt="Google Play" className="store-badge" />
                                </Link>
                                <img
                                    src="/download/qrcode.png"
                                    alt="QR Code"
                                    className="qr-code"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 text-center">
                        <img
                            src="/download/phone1.png"
                            alt="Companion App Install"
                            className="img-fluid phone-image"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Download;
