import React from "react";
import { Link } from "react-router-dom";


const ComingSoonPage: React.FC = () => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-content text-center">
        {/* Beautiful Coming Soon GIF */}
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXpyamM2bG1jano0MHhiajRtNWxuOG1ocWhxMDZxZzRxY2VqYXd3cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fiqeJhswRAtDLpSvFe/giphy.gif"
          alt="Coming Soon GIF"
          className="coming-soon-gif"
        />
        
        {/* Text Message */}
        <h2 className="coming-soon-message">We will be available soon</h2>

        {/* Go to Home Button */}
        <Link to="/" className="go-home-button btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoonPage;
