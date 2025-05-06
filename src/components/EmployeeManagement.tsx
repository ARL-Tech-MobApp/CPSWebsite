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
import MultiSelectDropdown from "./MultiSelectDropdown";

const PersonPlusIcon = BsPersonPlus as unknown as React.FC;
const CheckIcon = BsCheckCircle as unknown as React.FC;
const ArrowLeftIcon = BsArrowLeft as unknown as React.FC;


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

interface Props {
  formData: EmployeeFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { addEmployee,updateEmployee } = useEmployeeStore();

  const cityOptions = [
    "Bhubaneswar",
    "Cuttack",
    "Jajpur",
    "Salipur",
    "Rourkela",
    "Balasore",
    "Berhampur",
    "Puri",
  ].map((city) => ({
    label: city,
    value: city.toLowerCase().replace(/\s+/g, "_"),
  }));
   
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
  const handleCityChange = (selectedList: any[]) => {
    setFormData((prev) => ({
      ...prev,
      cities: selectedList.map((item) => item.value), // get the selected values
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formStep < 3) {
      setFormStep((prev) => prev + 1);
    } else {
      setIsUploading(true);
      try {
        if(formData?.id) {
          const updatedData = {
            id: formData.id,
            fullName: formData.fullName,
            position: formData.position,
            department: formData.department,
            dob: formData.dob,
            email: formData.email,
            phonenumber: formData.phone || "",
            address: formData.address || "",
            joiningdate: formData.joiningDate,
            salary: formData.salary?.toString() || "",
            cities: formData.cities || [],
          }
          await updateEmployee(formData.id,updatedData)
        }else{  
        await addEmployee({
          fullName: formData.fullName,
          position: formData.position,
          department: formData.department,
          dob: formData.dob,
          email: formData.email,
          phonenumber: formData.phone || "",
          address: formData.address || "",
          joiningdate: formData.joiningDate,
          salary: formData.salary?.toString() || "",
          cities: formData.cities || [],
        });
      }
        // Reset form
        setFormData({
          fullName: "",
          position: "",
          department: "",
          dob: "",
          email: "",
          joiningDate: new Date().toISOString().split("T")[0],
        });
        setFormStep(1);
        setIsUploading(false);
        setShowModal(false);
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
      position: "",
      department: "",
      dob: "",
      email: "",
      joiningDate: new Date().toISOString().split("T")[0],
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
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              {/* Add more positions as needed */}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <MultiSelectDropdown
        options={cityOptions}
        label="Choose Cities"
        value={formData.cities}
        onChange={handleCityChange}
      />

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
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              {/* Add more departments as needed */}
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
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3"
      >
        <PersonPlusIcon /> Add Employee
      </Button>

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
