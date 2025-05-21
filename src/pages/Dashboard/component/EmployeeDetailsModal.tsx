import React, { useRef, useEffect } from "react";
import { EmployeeDetailsModalProps } from "../types/employee";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Add this TypeScript declaration to extend the Window interface
declare global {
  interface Window {
    bootstrap: any;
  }
}


const EmployeeDetailsModal: React.FC<EmployeeDetailsModalProps> = ({
  show,
  details,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && modalRef.current) {
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();

      modalRef.current.addEventListener("hidden.bs.modal", onClose);
      
      return () => {
        modalRef.current?.removeEventListener("hidden.bs.modal", onClose);
        modal.dispose();
      };
    }
  }, [show, onClose]);

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      id="employeeDetailsModal"
      tabIndex={-1}
      aria-hidden={!show}
      ref={modalRef}
      style={{ display: show ? "block" : "none" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Employee Details</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {details ? (
              <>
                <p>
                  <strong>Name:</strong> {details.fullName || "N/A"}
                </p>
                <p>
                  <strong>Email:</strong> {details.email || "N/A"}
                </p>
                <p>
                  <strong>Dept:</strong> {details.department || "N/A"}
                </p>
                <p>
                  <strong>Position:</strong> {details.position || "N/A"}
                </p>
                <p>
                  <strong>Phone:</strong> {details.phoneNumber || "None"}
                </p>
                <p>
                  <strong>City:</strong> {details.city || "None"}
                </p>
              </>
            ) : (
              <p>No details available</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsModal;