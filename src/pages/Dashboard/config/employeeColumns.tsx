import { Column } from "../../../components/GenericTable";
import { Employee } from "../types/employee";
import { Button } from "react-bootstrap";

export const getEmployeeColumns = (
  handleView: (row: Employee) => void,
  handleEdit: (row: Employee) => void,
  deleteEmployee: (id: string) => void
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
  {
    key: "actions",
    title: "Actions",
    render: (row) => (
      <div>
        <Button
          variant="primary"
          size="sm"
          className="me-2 mb-2"
          onClick={() => handleView(row)}
        >
          View
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="me-2 mb-2"
          onClick={() => handleEdit(row)}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={() => deleteEmployee(row.id || "")}
        >
          Delete
        </Button>
      </div>
    ),
  },
];