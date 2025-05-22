import { Column } from "../../../components/GenericTable";
import { Employee } from "../types/employee";
import { Button } from "react-bootstrap";

export const getEmployeeColumns = (
): Column<Employee & { actions?: any }>[] => [
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
];