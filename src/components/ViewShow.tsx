import React from 'react'

interface ViewShowProps {
    showViewModal: boolean;
    setShowViewModal: (value: boolean) => void;
    formData: {
      fullName: string;
      position: string;
      department: string;
      dob: string;
      email: string;
      joiningDate: string;
      phone?: string;
      address?: string;
      salary?: string;
    };
    visitorFormData: {
      employeeId?: string;
      visitorType?: string[];
      description?: string;
      vendorName?: string;
      ownerName?: string;
      contact1?: string;
      contact2?: string;
      address?: string;
      pincode?: string;
      constructionMaterials?: string[];
      shopStatus?: string;
      hasVisitingCard: boolean;
    };
    viewType: "employee" | "survey" | null;
  }
  
  export default function ViewShow({
    showViewModal,
    setShowViewModal,
    formData,
    visitorFormData,
    viewType,
  }: ViewShowProps) {
  return (
    <div>
        {showViewModal && (
  <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            {viewType === "employee" ? "Employee Details" : "Survey Details"}
          </h5>
          <button className="btn-close" onClick={() => setShowViewModal(false)} />
        </div>
        <div className="modal-body">
          {viewType === "employee" ? (
            <ul>
              <li><strong>Name:</strong> {formData.fullName}</li>
              <li><strong>Email:</strong> {formData.email}</li>
              <li><strong>DOB:</strong> {formData.dob}</li>
              <li><strong>Position:</strong> {formData.position}</li>
              <li><strong>Department:</strong> {formData.department}</li>
              <li><strong>Phone:</strong> {formData.phone}</li>
              <li><strong>Address:</strong> {formData.address}</li>
              <li><strong>Joining Date:</strong> {formData.joiningDate}</li>
              <li><strong>Salary:</strong> {formData.salary}</li>
            </ul>
          ) : (
            <ul>
              <li><strong>Employee ID:</strong> {visitorFormData.employeeId}</li>
              <li><strong>Owner Name:</strong> {visitorFormData.ownerName}</li>
              <li><strong>Service Types:</strong> {visitorFormData.visitorType?.join(", ")}</li>
              <li><strong>Materials:</strong> {visitorFormData.constructionMaterials?.join(", ")}</li>
              <li><strong>Description:</strong> {visitorFormData.description}</li>
              <li><strong>Contact 1:</strong> {visitorFormData.contact1}</li>
              <li><strong>Contact 2:</strong> {visitorFormData.contact2}</li>
              <li><strong>Pincode:</strong> {visitorFormData.pincode}</li>
              <li><strong>Address:</strong> {visitorFormData.address}</li>
              <li><strong>Shop Status:</strong> {visitorFormData.shopStatus}</li>
              <li><strong>Has Visiting Card:</strong> {visitorFormData.hasVisitingCard ? "Yes" : "No"}</li>
            </ul>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
        </div>
      </div>
    </div>
  </div>
)}

      
    </div>
  )
}
