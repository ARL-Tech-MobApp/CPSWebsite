import React from "react";
import Header from "../components/Navbar";
import Footer from "../components/Footer";

const TermsAndConditions: React.FC = () => {
    return (
        <>
            <Header />
            <section className="terms-section py-5 " data-aos="fade-up">
                <div className="container text-center">
                    <h1 className="text-center fw-bold mb-2 text-blue" data-aos="fade-down">
                        Terms & Conditions
                    </h1>
                    <p className="text-muted mb-3 w-75 mx-auto">
                        Last updated: April 24, 2025
                    </p>
                </div>
            </section>

            <section className="terms-section1 pt-5 ">
                <div className="container">
                    <div className="mb-4">
                        <h4 className="fw-semibold">1. Acceptance of Terms</h4>
                        <p>
                            By accessing or using our website or services, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree, please refrain from using the site.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h4 className="fw-semibold">2. Use License</h4>
                        <p>
                            Permission is granted to temporarily download one copy of the materials for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h4 className="fw-semibold">3. Restrictions</h4>
                        <ul>
                            <li>Do not modify or copy the materials</li>
                            <li>Do not use the materials for any commercial purpose</li>
                            <li>Do not attempt to decompile or reverse engineer any software on the site</li>
                            <li>Do not remove copyright or other proprietary notations</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <h4 className="fw-semibold">4. Disclaimer</h4>
                        <p>
                            All materials on this website are provided “as is”. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of merchantability.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h4 className="fw-semibold">5. Limitations</h4>
                        <p>
                            In no event shall we be liable for any damages arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified of the possibility of such damage.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h4 className="fw-semibold">6. Modifications</h4>
                        <p>
                            We may revise these Terms & Conditions at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms.
                        </p>
                    </div>

                    <div className="text-center mt-5">
                        <p className="text-muted">If you have any questions about these Terms, please contact us.</p>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default TermsAndConditions;
