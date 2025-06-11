import React, { useState } from "react";
import { ProfileSectionProps } from "../types/employee";

const ProfileSection: React.FC<ProfileSectionProps> = ({ profileFields }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleFields = expanded ? profileFields : profileFields.slice(0, 2);
  console.log("ProfileSection Props:", visibleFields);

  return (
    <div className="card shadow shadow-sm rounded-4 p-4">
          <h3 className="mb-4 text-primary fw-bold text-center text-md-start">
            Profile Overview
          </h3>
          <div className="row">
            {visibleFields.map(({ label, value }) => (
              <div className="col-12 col-md-6 mb-3" key={label}>
                <strong>{label}:</strong> {value}
              </div>
            ))}
          </div>

          <div className="text-end">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Hide Details" : "See More"}
            </button>
          </div>
        </div>
  );
};

export default ProfileSection;