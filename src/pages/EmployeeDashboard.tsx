import React, { useEffect } from "react";
import GenericTable, { Column } from "../components/GenericTable";
import VisitorManagement from "../components/VisitorManagement";
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import EmployeeManagement from "../components/EmployeeManagement";
import { useEmployeeStore } from "../stores/employeeStore";
import { useSurveyStore, Survey } from "../stores/surveyStore";
import { Button } from "react-bootstrap";
import { useAuthStore } from "../stores/useAuthStore";

function EmployeeDashboard() {
  const { userProfile, profileLoading, logout } = useAuthStore();
  async function updateProfile(employeeId: String, data: any) {
    try {
      const response = await fetch(
        `https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/update-profile?employeeId=${employeeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      fetchEmployees();
      console.log("Profile updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  }

  type Employee = {
    fullName: string;
    dob: string;
    position: string;
    department: string;
    email: string;
    // phonenumber: string;
    // address: string;
    // joiningdate: string;
    // salary: string;
  };

  const { employees, fetchEmployees } = useEmployeeStore();

  const { surveys, surveyloading, fetchSurveys } = useSurveyStore();

  useEffect(() => {
    fetchEmployees();
    fetchSurveys();
  }, [fetchEmployees, fetchSurveys]);

  console.log("surveys", surveys);

  const userColumns: Column<Employee>[] = [
    { key: "fullName", title: "Name", sortable: true },
    { key: "dob", title: "D.O.B", sortable: true },
    { key: "position", title: "Position" },
    { key: "department", title: "Department" },
    { key: "email", title: "Email" },
  ];

  const surveyColumns: Column<Survey>[] = [
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
  ];
  console.log("surveys", surveys);
  const surveyData =
    userProfile?.isAdmin === "true"
      ? surveys?.map((suvey) => ({
          employeeId: suvey?.employeeId ?? "None",
          ownerName: suvey?.ownerName ?? "None",
          serviceType: suvey?.serviceType ?? "None",
          materialName: suvey?.materialName ?? "None",
          description: suvey?.description ?? "None",
          contact1: suvey?.contact1 ?? "None",
          contact2: suvey?.contact2 ?? "None",
          visitingCardUrl: suvey?.visitingCardUrl ? (
            <img
              src={String(suvey?.visitingCardUrl)}
              alt=""
              width={100}
              height={100}
            />
          ) : (
            <p>None</p>
          ),
          pincode: suvey?.pincode ?? "None",
          address: suvey?.address ?? "None",
        }))
      : surveys
          ?.filter((item, index) => item?.employeeId === userProfile?.id)
          ?.map((suvey) => ({
            employeeId: suvey?.employeeId ?? "None",
            ownerName: suvey?.ownerName ?? "None",
            serviceType: suvey?.serviceType ?? "None",
            materialName: suvey?.materialName ?? "None",
            description: suvey?.description ?? "None",
            contact1: suvey?.contact1 ?? "None",
            contact2: suvey?.contact2 ?? "None",
            visitingCardUrl: suvey?.visitingCardUrl ? (
              <img
                src={String(suvey?.visitingCardUrl)}
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <p>None</p>
            ),
            pincode: suvey?.pincode ?? "None",
            address: suvey?.address ?? "None",
          }));
  const employeeData = employees?.map((emp) => ({
    fullName: emp?.fullName,
    dob: emp?.dob,
    position: emp?.position,
    email: emp?.email,
    department: emp?.department,
  }));

  console.log("userProfile?.isAdmin", userProfile);

  return (
    <div>
      <Header />
      <div className="container my-5">
        <nav className="my-3">
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
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
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
          >
            {userProfile?.isAdmin === "true" ? (
              <>
                <EmployeeManagement />
                <GenericTable
                  columns={userColumns}
                  heading="Employee Details"
                  rowsPerPage={5}
                  themeColor="#007bff"
                  onSelectionChange={() => {}}
                  data={employeeData}
                />
              </>
            ) : (
              <p>You don't have Access To This Section</p>
            )}
          </div>

          <div
            className="tab-pane fade"
            id="nav-profile"
            role="tabpanel"
            aria-labelledby="nav-profile-tab"
          >
            <VisitorManagement />
            <GenericTable
              columns={surveyColumns}
              heading="Survey Details"
              rowsPerPage={5}
              themeColor="#007bff"
              onSelectionChange={() => {}}
              data={surveyData}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EmployeeDashboard;
