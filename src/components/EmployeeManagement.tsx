import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  ListGroup,
} from "react-bootstrap";
import { BsPersonPlus, BsCheckCircle, BsArrowLeft } from "react-icons/bs";
import { useEmployeeStore } from "../stores/employeeStore";

const PersonPlusIcon = BsPersonPlus as unknown as React.FC;
const CheckIcon = BsCheckCircle as unknown as React.FC;
const ArrowLeftIcon = BsArrowLeft as unknown as React.FC;

interface EmployeeFormData {
  id?: string;
  fullName: string;
  empId?: string;
  position: string;
  department: string;
  dob: string;
  email: string;
  phone?: string;
  address?: string;
  joiningDate: string;
  salary?: string;
  city?: string;
}

interface Props {
  formData: EmployeeFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  isEditMode?: boolean;
  setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>;

}

type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;
const EmployeeManagement: React.FC<Props> = ({
  formData,
  setFormData,
  showModal,
  setShowModal,
  isEditMode,
  setIsEditMode,
}) => {
console.log("hdsffjds",formData)

  const [isUploading, setIsUploading] = useState(false);
  const { addEmployee, updateEmployee } = useEmployeeStore();

  const [formStep, setFormStep] = useState<number>(1);
  const handleInputChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep < 3) {
      setFormStep((prev) => prev + 1);
    } else {
      setIsUploading(true);
      try {
        if (isEditMode) {
          const updatedData = {
            empId: formData.id,
            fullName: formData.fullName,
            position: formData.position,
            department: formData.department,
            dob: formData.dob,
            email: formData.email,
            phoneNumber: formData.phone || "",
            address: formData.address || "",
            joiningDate: formData.joiningDate,
            salary: formData.salary?.toString() || "",
            city: formData.city || "",
          };
          await updateEmployee(formData.id || "", updatedData);
          alert("Employee updated successfully!");
        } else {
          await addEmployee({
            empId: formData.id,
            fullName: formData.fullName,
            position: formData.position,
            department: formData.department,
            dob: formData.dob,
            email: formData.email,
            phoneNumber: formData.phone || "",
            address: formData.address || "",
            joiningDate: formData.joiningDate,
            salary: formData.salary?.toString() || "",
            city: formData.city || "",
          });
          alert(`${formData.id} added successfully!`);
          // console.log(formData)
        }
        // Reset form
        setFormData({
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
          city: "",
        });
        setFormStep(1);
        setIsUploading(false);
        setShowModal(false);
        setIsEditMode && setIsEditMode(false);
      } catch (error) {
        setIsUploading(false);
        console.error("❌ Failed to submit data:", error);
        alert("There was an error submitting the form. Please try again.");
      }
    }
  };

  const handleBack = () => {
    setFormStep((prev) => Math.max(1, prev - 1));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      empId: "",
      position: "",
      department: "",
      dob: "",
      email: "",
      joiningDate: new Date().toISOString().split("T")[0],
      phone: "",
      address: "",
      salary: "",
      city: "",
    });
    setFormStep(1);
    setShowModal(false);
  };

  const renderStepOne = () => (
    <>
      <h5 className="mb-4">Basic Information</h5>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>EmployeeId*</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={formData?.id}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Full Name*</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Department*</Form.Label>
            <Form.Control
              as="select"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Sales & Marketing">Sales & Marketing</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              {/* Add more departments as needed */}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Position*</Form.Label>
            <Form.Control
              as="select"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Position</option>
              <option value="GM">GM</option>
              <option value="ZM">ZM</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Back-End Developer">Back-End Developer</option>
              <option value="Front-End Developer">Front-End Developer</option>
              <option value="CRM">CRM</option>
              <option value="FSA">FSA</option>
              <option value="Graphic Desingner">Graphic Desingner</option>
              <option value="Accounts Executive">Accounts Executive</option>
              <option value="CareTaker">CareTaker</option>
              {/* Add more positions as needed */}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>City*</Form.Label>
            <Form.Control
              as="select"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
            >
              <option value="">Select City</option>
              <option value="Bhubaneswar">Bhubaneswar</option>
              <option value="Bhubaneswar(HO)">Bhubaneswar(HO)</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Vishakhapatnam">Vishakhapatnam</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Raipur">Raipur</option>
              {/* Add more positions as needed */}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Date of Birth*</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );

  const renderStepTwo = () => (
    <>
      <h5 className="mb-4">Contact Information</h5>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="address"
          value={formData.address || ""}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
    </>
  );

  const renderStepThree = () => (
    <>
      <h5 className="mb-4">Employment Details</h5>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Joining Date*</Form.Label>
            <Form.Control
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Salary (₹)</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              value={formData.salary || ""}
              onChange={handleInputChange}
              min="0"
            />
          </Form.Group>
        </Col>
      </Row>

      <h5 className="mt-4 mb-3">Review Details</h5>
      <Card className="mb-3">
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Name:</strong> {formData.fullName}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Position:</strong> {formData.position}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Department:</strong> {formData.department}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Date of Birth:</strong> {formData.dob}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Email:</strong> {formData.email}
          </ListGroup.Item>
          {formData.phone && (
            <ListGroup.Item>
              <strong>Phone:</strong> {formData.phone}
            </ListGroup.Item>
          )}
          {formData.address && (
            <ListGroup.Item>
              <strong>Address:</strong> {formData.address}
            </ListGroup.Item>
          )}
          <ListGroup.Item>
            <strong>Joining Date:</strong> {formData.joiningDate}
          </ListGroup.Item>
          {formData.salary && (
            <ListGroup.Item>
              <strong>Salary:</strong> ₹{formData.salary.toLocaleString()}
            </ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </>
  );

  return (
    <>

      <Modal show={showModal} onHide={resetForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Employee Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {formStep === 1 && renderStepOne()}
            {formStep === 2 && renderStepTwo()}
            {formStep === 3 && renderStepThree()}

            <div className="d-flex justify-content-between mt-4">
              {formStep > 1 && (
                <Button variant="outline-secondary" onClick={handleBack}>
                  <ArrowLeftIcon /> Back
                </Button>
              )}
              <Button
                variant={formStep === 3 ? "success" : "primary"}
                type="submit"
                disabled={isUploading}
              >
                {formStep === 3 ? (
                  <>
                    <CheckIcon /> Submit{" "}
                    {isUploading && (
                      <span
                        className="spinner-border spinner-border-sm ms-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                  </>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EmployeeManagement;
