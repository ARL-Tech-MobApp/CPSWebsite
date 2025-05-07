import React, { useEffect, useRef, useState } from "react";

// Extend the Window interface to include bootstrap

import GenericTable, { Column } from "../components/GenericTable";
import VisitorManagement from "../components/VisitorManagement";
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import EmployeeManagement from "../components/EmployeeManagement";
import { useEmployeeStore } from "../stores/employeeStore";
import { useSurveyStore, Survey } from "../stores/surveyStore";
import { Button } from "react-bootstrap";
import { useAuthStore } from "../stores/useAuthStore";
import { Console } from "console";
import ViewShow from "../components/ViewShow";
import moment from "moment";
import DailyWorksheet from "../components/DailyWorksheet";

interface EmployeeFormData {
  id?: string; // Optional for new employees
  empId?: string; // Added employeeId to match the required type
  fullName: string;
  position: string;
  department: string;
  dob: string;
  email: string;
  phone?: string;
  address?: string;
  joiningDate: string;
  salary?: string;
  cities?: string[];
  city?: string; // Added city property
}

declare global {
  interface Window {
    bootstrap: any;
  }
}

type VisitorType =
  | "excavator"
  | "mixture_machine"
  | "construction_material"
  | "cement steel store"
  | "local supplier"
  | "marbal & tile store"
  | "concrete product"
  | "other";
type ConstructionMaterial = "sand" | "bricks" | "cement" | "steel";
type ShopStatus = "with_shop" | "without_shop";

interface VisitFormData {
  employeeId?: string;
  visitorType: VisitorType[];
  hasVisitingCard: boolean;
  visitingCard?: File | null;
  description?: string;
  vendorName?: string;
  ownerName?: string;
  contact1?: string;
  contact2?: string;
  whatsappNumber?: string;
  address?: string;
  pincode?: string;
  constructionMaterials?: ConstructionMaterial[];
  shopStatus?: ShopStatus;
}

function EmployeeDashboard() {
  const { userProfile, profileLoading, logout, accessToken } = useAuthStore();
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewType, setViewType] = useState<"employee" | "survey" | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const profileFields = [
    { label: "Full Name", value: userProfile?.fullName },
    { label: "Position", value: userProfile?.position },
    { label: "Department", value: userProfile?.department },
    // { label: "City", value: userProfile?.city },
    // { label: "Date of Birth", value: userProfile?.dob },
    // { label: "Email", value: userProfile?.email || "N/A" },
    // { label: "Phone", value: userProfile?.phoneNumber },
    // { label: "Address", value: userProfile?.address },
    // { label: "Joining Date", value: userProfile?.joiningDate },
    // { label: "Salary", value: `$${userProfile?.salary.toLocaleString()}` },
    // {
    //   label: "Created At",
    //   value: new Date(userProfile?.createdAt).toLocaleString(),
    // },
  ];

  const [expanded, setExpanded] = useState(false);
  interface EmployeeDetails {
    fullName?: string;
    email?: string;
    department?: string;
    position?: string;
    phoneNumber?: string;
    city?: string;
  }
  
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState<{
    details: EmployeeDetails;
    status: boolean;
  }>({
    details: {},
    status: false,
  });
  const visibleFields = expanded ? profileFields : profileFields.slice(0, 2);

  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: "",
    id: "",
    position: "",
    department: "",
    dob: "",
    email: "",
    joiningDate: new Date().toISOString().split("T")[0],
    phone: "",
    address: "",
    salary: "",
    cities: [],
    city: "",
  });
  const [visitorFormData, setVisitorFormData] = useState<VisitFormData>({
    visitorType: [],
    hasVisitingCard: false,
  });

  type Employee = {
    id?: string;
    fullName: string;
    dob: string;
    position: string;
    department: string;
    phoneNumber: string;
    address: string;
    joiningDate: string;
    salary: string;
    email: string;
    createdAt: string;
    city: string;
  };

  const { employees, fetchEmployees,deleteEmployee } = useEmployeeStore();
  const { surveys,deleteSurvey, surveyloading, fetchSurveys, lastKey, } = useSurveyStore();
  console.log("surveys", surveys);
  useEffect(() => {
    // Fetch the first batch of data
    fetchSurveys();
  }, [fetchSurveys]);

  // const handleLoadMore = () => {
  //   if (!lastKey) return; // No more data to fetch
  //   fetchSurveys("2", lastKey);
  // };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEdit = (employee: Employee) => {
    setFormData({
      id: employee.id,
      fullName: employee.fullName,
      position: employee.position,
      department: employee.department,
      city: employee.city,
      dob: employee.dob,
      email: employee.email,
      phone: employee.phoneNumber,
      address: employee.address,
      salary: employee.salary,
      joiningDate: moment(employee.joiningDate, "dddd, DD MMM [at] hh:mm A").format("YYYY-MM-DD")

    });
    setShowEmployeeModal(true);
    setIsEditMode(true);
  };
  

  console.log("formvisitordata", visitorFormData);

  const handleEditVisitor = (survey: Survey) => {
    setVisitorFormData({
      employeeId: survey.employeeId ?? "",
      visitorType: survey.visitorType
        ? (survey.visitorType.split(",") as VisitorType[])
        : [],
      description: survey.description ?? "",
      vendorName: survey.vendorName ?? "",
      ownerName: survey.ownerName ?? "",
      contact1: survey.contact1 ?? "",
      contact2: survey.contact2==="None"?"":survey.contact2 ?? "",
      whatsappNumber: survey.whatsappNumber ?? "",
      address: survey.address ?? "",
      pincode: survey.pincode ?? "",
      constructionMaterials: survey.constructionMaterials
        ? (survey.constructionMaterials.split(",") as ConstructionMaterial[])
        : [],
      shopStatus: (survey.shopStatus as ShopStatus) ?? undefined,
      hasVisitingCard: !!survey.visitingCardUrl,
      visitingCard: undefined, // Visiting card file can't be restored from URL
    });
    setShowVisitorModal(true);
  };


  const handleView = (item: any) => {
    if ("fullName" in item) {
      // it's an employee
      setFormData({
        id: item.id,
        fullName: item.fullName,
        position: item.position,
        department: item.department,
        city: item.city,
        dob: item.dob,
        email: item.email,
        phone: item.phoneNumber,
        address: item.address,
        salary: item.salary,
        joiningDate: item.joiningDate,
      });
      setViewType("employee");
    } else {
      // it's a survey
      setVisitorFormData({
        employeeId: item.employeeId ?? "",
        visitorType: item.visitorType
          ? (item.visitorType.split(",") as VisitorType[])
          : [],
        description: item.description ?? "",
        vendorName: item.vendorName ?? "",
        ownerName: item.ownerName ?? "",
        contact1: item.contact1 ?? "",
        contact2: item.contact2 ?? "",
        address: item.address ?? "",
        pincode: item.pincode ?? "",
        constructionMaterials: item.constructionMaterials
          ? (item.constructionMaterials.split(",") as ConstructionMaterial[])
          : [],
        shopStatus: (item.shopStatus as ShopStatus) ?? undefined,
        hasVisitingCard: !!item.visitingCardUrl,
        visitingCard: undefined,
      });
      setViewType("survey");
    }
    setShowViewModal(true);
  };

  const userColumns: Column<Employee & { actions?: any }>[] = [
    { key: "id", title: "ID", sortable: true },
    { key: "fullName", title: "Name", sortable: true },
    { key: "dob", title: "D.O.B", sortable: true },
    { key: "phoneNumber", title: "Phone Number" },
    { key: "joiningDate", title: "Joining Date" },
    { key: "salary", title: "Salary" },
    { key: "position", title: "Position" },
    { key: "department", title: "Department" },
    { key: "email", title: "Email" },
    { key: "createdAt", title: "Created At" },

    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleView(row)}
          >
            view
          </button>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteEmployee({id:row?.id})}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const surveyColumns: Column<Survey & { actions?: any }>[] = [
    { key: "employeeId", title: "Employee ID", sortable: true },
    { key: "ownerName", title: "Owner Name", sortable: true },
    { key: "visitorType", title: "Visitor Type" },
    { key: "constructionMaterials", title: "Material Name" },
    { key: "description", title: "Description" },
    { key: "contact1", title: "Contact" },
    { key: "contact2", title: "Alt. Contact" },
    {
      key: "visitingCardUrl",
      title: "Visiting Card",
      render: (row) => (
        row.visitingCardUrl ? (
          <img
            src={String(row.visitingCardUrl)}
            alt="Visiting Card"
            style={{ width: "100px", height: "auto", objectFit: "cover", cursor: "pointer" }}
            onClick={() => setSelectedImage(typeof row.visitingCardUrl === 'string' ? row.visitingCardUrl : null)}
          />
        ) : (
          "No Image"
        )
      ),
    },
    { key: "pincode", title: "Pincode" },
    { key: "address", title: "Address" },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div>
           <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleView(row)}
          >
            view
          </button>
          <button
            className="btn btn-sm btn-primary me-2"
            onClick={() => handleEditVisitor(row)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => deleteSurvey({surveyId:row?.id})}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // If surveys have an ARRAY of employeeIds (e.g., item.employeeIds):
  const filteredSurveys =
    userProfile?.isAdmin === "true"
      ? surveys // Show all surveys if admin (boolean check)
      : surveys?.filter((item) => {
          const employeeId = item?.employeeId?.toLowerCase()?.trim() || "";
          const userId = userProfile?.id?.toLowerCase()?.trim() || "";
          return employeeId === userId;
        }) || [];
  useEffect(() => {
    if (showEmployeeDetailsModal.status && modalRef.current) {
      const modalInstance = new window.bootstrap.Modal(modalRef.current);
      modalInstance.show();

      // Optional: Reset state when modal is closed
      modalRef.current.addEventListener(
        "hidden.bs.modal",
        () => {
          setShowEmployeeDetailsModal({ status: false, details: {} });
        },
        { once: true }
      );
    }
  }, [showEmployeeDetailsModal.status]);
  const sortedSurveys = filteredSurveys?.slice()?.reverse();
  const sortedEmployees = employees?.slice()?.reverse();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const surveyData = sortedSurveys?.map((survey) => ({
      ...survey,
      actions: (
        <div>
          <Button
            onClick={() =>
              setShowEmployeeDetailsModal({
                details: survey?.employee,
                status: true,
              })
            }
            className="btn btn-sm btn-primary"
          >
            Show Details
          </Button>
        </div>
      ),
    }));
  console.log("sortedEmployees", sortedEmployees);

  const employeeData: Employee[] = (sortedEmployees ?? [])
    .filter((emp): emp is Employee => !!emp)
    .map((emp) => ({
      id: emp.id,
      fullName: emp.fullName || "N/A",
      dob: emp.dob || "N/A",
      position: emp.position || "N/A",
      department: emp.department || "N/A",
      email: emp.email || "N/A",
      phoneNumber: emp.phoneNumber || "N/A",
      address: emp.address || "N/A",
      city: emp.city || "N/A",
      joiningDate: emp.joiningDate
        ? moment(emp.joiningDate).format("dddd, D MMMM [at] h:mm A")
        : "N/A",
      salary: emp.salary || "N/A",
      createdAt: emp.createdAt
        ? moment(emp.createdAt).format("dddd, D MMMM [at] h:mm A")
        : "N/A",
    }));
  console.log("employeeData", formData);

  return (
    <div>
      <Header />
      {/* profile */}
      <div className="container mt-4">
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
      </div>
      <div className="container my-5">
        <nav className="my-3">
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            {userProfile?.isAdmin === "true" ? (
              <>
                <button
                  className="nav-link active"
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Employee Details
                </button>
                <button
                  className="nav-link"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                >
                  Survey Details
                </button>
                <button
                  className="nav-link"
                  id="nav-worksheet-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-worksheet"
                  type="button"
                  role="tab"
                  aria-controls="nav-worksheet"
                  aria-selected="true"
                >
                  WorkSheet
                </button>
              </>
            ) : (
              <>
                <button
                  className="nav-link active"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="true"
                >
                  Survey Details
                </button>
                <button
                  className="nav-link"
                  id="nav-worksheet-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-worksheet"
                  type="button"
                  role="tab"
                  aria-controls="nav-worksheet"
                  aria-selected="true"
                >
                  WorkSheet
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="tab-content" id="nav-tabContent">
          <div
            className={`tab-pane fade ${
              userProfile?.isAdmin === "true" ? "show active" : ""
            }`}
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            {userProfile?.isAdmin === "true" && (
              <>
                <EmployeeManagement
                  formData={formData}
                  setFormData={setFormData}
                  showModal={showEmployeeModal}
                  setShowModal={setShowEmployeeModal}
                  isEditMode={isEditMode}
                  setIsEditMode={setIsEditMode}
                />
                <GenericTable
                  columns={userColumns}
                  heading="Employee Details"
                  rowsPerPage={5}
                  themeColor="#007bff"
                  onSelectionChange={() => {}}
                  data={employeeData}
                />
              </>
            )}
          </div>

          <div
            className={`tab-pane fade ${
              userProfile?.isAdmin !== "true" ? "show active" : ""
            }`}
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <VisitorManagement
              formData={visitorFormData}
              setFormData={setVisitorFormData}
              showModal={showVisitorModal}
              setShowModal={setShowVisitorModal}
            />
            <GenericTable
              columns={surveyColumns}
              heading="Survey Details"
              rowsPerPage={5}
              themeColor="#007bff"
              onSelectionChange={() => {}}
              data={surveyData}
              fetch={(lastKey) => fetchSurveys("2", lastKey)} // Pass a function, not the result
              lastkey={lastKey}
            />
          </div>
          <div
            className={"tab-pane fade"}
            id="nav-worksheet"
            role="tabpanel"
            aria-labelledby="nav-worksheet-tab"
          >
            <DailyWorksheet/>
          </div>
        </div>
      </div>
      <ViewShow
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        formData={formData}
        visitorFormData={visitorFormData}
        viewType={viewType}
      />
      <div
        className="modal fade"
        id="employeeDetailsModal"
        tabIndex={-1}
        aria-hidden="true"
        ref={modalRef}
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
              ></button>
            </div>
            <div className="modal-body">
              {showEmployeeDetailsModal.details ? (
                <>
                  <p>
                    <strong>Name:</strong>{" "}
                    {showEmployeeDetailsModal.details.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {showEmployeeDetailsModal.details.email}
                  </p>
                  <p>
                    <strong>Dept:</strong>{" "}
                    {showEmployeeDetailsModal.details.department}
                  </p>
                  <p>
                    <strong>Position:</strong>{" "}
                    {showEmployeeDetailsModal.details.position}
                  </p>
                  <p>
                    <strong>PhoneNumber:</strong>{" "}
                    {showEmployeeDetailsModal.details.phoneNumber ?? "None"}
                  </p>
                  <p>
                    <strong>City:</strong>{" "}
                    {showEmployeeDetailsModal.details.city ?? "None"}
                  </p>
                  {/* Add more fields as needed */}
                </>
              ) : (
                <p>No details available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={selectedImage}
            alt="Full Visiting Card"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 8,
              boxShadow: "0 0 10px #fff",
            }}
          />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default EmployeeDashboard;
