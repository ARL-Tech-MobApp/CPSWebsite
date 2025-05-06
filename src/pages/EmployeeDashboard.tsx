import React, { useEffect,useState } from "react";
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
interface EmployeeFormData {
  id?: string; // Optional for new employees
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
}

type VisitorType =
  | "excavator"
  | "mixture_machine"
  | "construction_material"
  | "cement steel store"
  |"local supplier"
  |"marbal & tile store"
  |"concrete product"
  | "other"
  ;
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

  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: "",
    position: "",
    department: "",
    dob: "",
    email: "",
    joiningDate: new Date().toISOString().split("T")[0], // Default to today's date
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
    phonenumber: string;
    address: string;
    joiningdate: string;
    salary: string;
    email: string;
    createdAt: string;
    cities: string[];
  };
  

  const { employees, fetchEmployees } = useEmployeeStore();
  const { surveys, surveyloading, fetchSurveys,lastKey } = useSurveyStore();
  console.log("surveys", surveys);
  useEffect(() => {
    // Fetch the first batch of data
    fetchSurveys("2");
  }, [fetchSurveys]);

  const handleLoadMore = () => {
    if (!lastKey) return; // No more data to fetch
    fetchSurveys("2", lastKey);
  };

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleEdit = (employee: Employee) => {
    setFormData({
      id: employee.id,
      fullName: employee.fullName,
      position: employee.position,
      department: employee.department,
      dob: employee.dob,
      email: employee.email,
      phone: employee.phonenumber,
      address: employee.address,
      salary: employee.salary,
      joiningDate: employee.joiningdate, // Use the existing joining date if available
    });
    setShowEmployeeModal(true);
  };
  const handleDelete = async (employee: Employee) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await fetch(
            `https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/delete-employee?employeeId=${employee.id}`,
          {
            method: "DELETE",
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        await fetchEmployees();
        alert("Employee deleted successfully.");
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee.");
      }
    }
  };

console.log("formvisitordata", visitorFormData)

  const handleEditVisitor = (survey: Survey) => {
    setVisitorFormData({
      employeeId: survey.employeeId ?? "",
      visitorType: survey.serviceType ? survey.serviceType.split(",") as VisitorType[] : [],
      description: survey.description ?? "",
      vendorName: survey.vendorName ?? "",
      ownerName: survey.ownerName ?? "",
      contact1: survey.contact1 ?? "",
      contact2: survey.contact2 ?? "",
      address: survey.address ?? "",
      pincode: survey.pincode ?? "",
      constructionMaterials: survey.materialName ? survey.materialName.split(",") as ConstructionMaterial[] : [],
      shopStatus: survey.shopType as ShopStatus ?? undefined,
      hasVisitingCard: !!survey.visitingCardUrl,
      visitingCard: undefined, // Visiting card file can't be restored from URL
    });
    setShowVisitorModal(true);
  };

  
  const handleDeleteVisitor = async (survey: Survey) => {
    if (window.confirm("Are you sure you want to delete this visitor?")) {
      try {
        const response = await fetch(
          `https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/delete-visitor?employeeId=${survey.employeeId}`,
          {
            method: "DELETE",
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        await fetchEmployees();
        alert("visitor deleted successfully.");
      } catch (error) {
        console.error("Error deleting visitor:", error);
        alert("Failed to delete visitor.");
      }
    }
  };
  
  const handleView = (item: any) => {
    if ("fullName" in item) {
      // it's an employee
      setFormData({
        id: item.id,
        fullName: item.fullName,
        position: item.position,
        department: item.department,
        dob: item.dob,
        email: item.email,
        phone: item.phonenumber,
        address: item.address,
        salary: item.salary,
        joiningDate: item.joiningdate,
      });
      setViewType("employee");
    } else {
      // it's a survey
      setVisitorFormData({
        employeeId: item.employeeId ?? "",
        visitorType: item.serviceType ? item.serviceType.split(",") as VisitorType[] : [],
        description: item.description ?? "",
        vendorName: item.vendorName ?? "",
        ownerName: item.ownerName ?? "",
        contact1: item.contact1 ?? "",
        contact2: item.contact2 ?? "",
        address: item.address ?? "",
        pincode: item.pincode ?? "",
        constructionMaterials: item.materialName ? item.materialName.split(",") as ConstructionMaterial[] : [],
        shopStatus: item.shopType as ShopStatus ?? undefined,
        hasVisitingCard: !!item.visitingCardUrl,
        visitingCard: undefined,
      });
      setViewType("survey");
    }
    setShowViewModal(true);
  };
  

  const userColumns: Column<Employee& { actions?: any }>[]= [
    { key: "id", title: "ID", sortable: true },
    { key: "fullName", title: "Name", sortable: true },
    { key: "dob", title: "D.O.B", sortable: true },
    { key: "phonenumber", title: "Phone Number" },
    { key: "joiningdate", title: "Joining Date" },
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
          <button className="btn btn-sm btn-primary me-2" onClick={() => handleView(row)}>view</button>
          <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(row)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row)}>Delete</button>
        </div>
      ),
    },
  ];

  const surveyColumns: Column<Survey& { actions?: any }>[] = [
    { key: "employeeId", title: "Employee ID", sortable: true },
    { key: "ownerName", title: "Owner Name", sortable: true },
    { key: "serviceType", title: "Service Type" },
    { key: "materialName", title: "Material Name" },
    { key: "description", title: "Description" },
    { key: "contact1", title: "Contact" },
    { key: "contact2", title: "Alt. Contact" },
    { key: "visitingCardUrl", title: "Visiting Card" },
    { key: "pincode", title: "Pincode" },
    { key: "address", title: "Address" },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div>
          <button className="btn btn-sm btn-primary me-2" onClick={() => handleView(row)}>view</button>

          <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditVisitor(row)}>Edit</button>
          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteVisitor(row)}>Delete</button>
        </div>
      ),
    },
  ];

// If surveys have an ARRAY of employeeIds (e.g., item.employeeIds):
const filteredSurveys = userProfile?.isAdmin==="true"
  ? surveys  // Show all surveys if admin (boolean check)
  : surveys?.filter((item) => {
      const employeeId = item?.employeeId?.toLowerCase()?.trim() || '';
      const userId = userProfile?.id?.toLowerCase()?.trim() || '';
      return employeeId === userId;
    }) || [];

  const sortedSurveys = filteredSurveys?.slice()?.reverse();
  const sortedEmployees = employees?.slice()?.reverse();

  

  const surveyData = sortedSurveys?.map((survey) => ({
    employeeId: survey?.employeeId ?? "None",
    ownerName: survey?.ownerName ?? "None",
    serviceType: survey?.serviceType ?? "None",
    materialName: survey?.materialName ?? "None",
    description: survey?.description ?? "None",
    contact1: survey?.contact1 ?? "None",
    contact2: survey?.contact2 ?? "None",
    visitingCardUrl: survey?.visitingCardUrl ? (
      <img
        src={String(survey?.visitingCardUrl)}
        alt=""
        width={100}
        height={100}
      />
    ) : (
      <p>None</p>
    ),
    pincode: survey?.pincode ?? "None",
    address: survey?.address ?? "None",
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
    phonenumber: emp.phonenumber || "N/A",
    address: emp.address || "N/A",
    cities: emp.cities || ["N/A"],
    joiningdate: emp.joiningdate
  ? moment(emp.joiningdate).format("dddd, D MMMM [at] h:mm A")
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
              </>
            ) : (
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
                <EmployeeManagement formData={formData} setFormData={setFormData}  showModal={showEmployeeModal} setShowModal={setShowEmployeeModal} />
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
            <VisitorManagement formData={visitorFormData} setFormData={setVisitorFormData} showModal={showVisitorModal} setShowModal={setShowVisitorModal} />
            <GenericTable
              columns={surveyColumns}
              heading="Survey Details"
              rowsPerPage={5}
              themeColor="#007bff"
              onSelectionChange={() => {}}
              data={surveyData}
              fetch={(lastKey) => fetchSurveys("2", lastKey)}  // Pass a function, not the result
              lastkey={lastKey}
            />
          </div>
        </div>
      </div>
      <ViewShow showViewModal={showViewModal} setShowViewModal={setShowViewModal} formData={formData} visitorFormData={visitorFormData} viewType={viewType}/>
      <Footer />
    </div>
  );
}

export default EmployeeDashboard;
