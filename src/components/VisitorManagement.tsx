import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Accordion,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { BsUpload, BsCheckCircle, BsArrowLeft } from "react-icons/bs";
import { useSurveyStore } from "../stores/surveyStore";
import { useAuthStore } from "../stores/useAuthStore";
import axios from "axios";

const UploadIcon = BsUpload as unknown as React.FC;
const CheckIcon = BsCheckCircle as unknown as React.FC;
const ArrowLeftIcon = BsArrowLeft as unknown as React.FC;

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

interface VisitorFormData {
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

interface Props {
  formData: VisitorFormData;
  setFormData: React.Dispatch<React.SetStateAction<VisitorFormData>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const VisitorManagement: React.FC<Props> = ({
  formData,
  setFormData,
  showModal,
  setShowModal,
}) => {
  const [showUploadProgress, setShowUploadProgress] = useState(false);
  const { fetchSurveys, addSurvey, surveyloading } = useSurveyStore();
  const { userProfile, profileLoading } = useAuthStore();
  const [formStep, setFormStep] = useState<number>(1);
  const [submittedData, setSubmittedData] = useState<VisitorFormData[]>([]);
  console.log("formDatahdfi", formData);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      if (name === "visitorType") {
        setFormData((prev) => ({
          ...prev,
          visitorType: checked
            ? [...prev.visitorType, value as VisitorType]
            : prev.visitorType.filter((item) => item !== value),
        }));
      } else if (name === "constructionMaterials") {
        setFormData((prev) => ({
          ...prev,
          constructionMaterials: checked
            ? [
                ...(prev.constructionMaterials || []),
                value as ConstructionMaterial,
              ]
            : (prev.constructionMaterials || []).filter(
                (item) => item !== value
              ),
        }));
      } else if (name === "hasVisitingCard") {
        setFormData((prev) => ({
          ...prev,
          hasVisitingCard: checked,
          visitingCard: checked ? prev.visitingCard : null, // reset visiting card when unchecked
        }));
      }
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : null,
      }));
    } else if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name]: value as ShopStatus,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  // Handle selecting WhatsApp number
  const handleWhatsappChange = (contactNumber: string) => {
    setFormData((prev) => ({
      ...prev,
      whatsappNumber: contactNumber,
    }));
  };

  const validateForm = (): string | null => {
    if (formStep === 1) {
      if (formData.visitorType.length === 0) {
        return "Please select at least one visitor type.";
      }
    }

    if (formStep === 2) {
      if (formData.hasVisitingCard && !formData.visitingCard) {
        return "Please upload a visiting card.";
      }

      if (!formData.hasVisitingCard) {
        if (!formData.vendorName?.trim()) return "Vendor name is required.";
        if (!formData.ownerName?.trim()) return "Owner name is required.";
        if (!formData.contact1?.trim()) return "Primary contact is required.";
        if (!/^\d{10}$/.test(formData.contact1))
          return "Enter valid 10-digit contact.";
        if (formData.contact2 && !/^\d{10}$/.test(formData.contact2)) {
          return "Enter valid 10-digit secondary contact.";
        }
        if (!formData.whatsappNumber) {
          return "please select the check box for which is ur whtsappNumer.";
        }
        if (!formData.address?.trim()) return "Address is required.";
        if (!formData.pincode?.trim()) return "Pincode is required.";
        if (!/^\d{6}$/.test(formData.pincode))
          return "Enter valid 6-digit pincode.";
        if (!formData.description?.trim()) {
          return "Description is required.";
        }
      }

      if (
        formData.visitorType.includes("construction_material") &&
        (!formData.constructionMaterials ||
          formData.constructionMaterials.length === 0)
      ) {
        return "Please select at least one construction material.";
      }
      if (
        formData.visitorType.includes("construction_material") &&
        !formData.shopStatus
      )
        return "Please select a shop status.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    if (formStep < 3) {
      setFormStep((prev) => prev + 1);
      return;
    }
    setShowUploadProgress(true);
    console.log("formData", formData);
    try {
      // Prepare survey data without the file
      const surveyData = {
        employeeId: userProfile?.id || "None",
        visitorType: formData.visitorType.join(",") || "None",
        description: formData.description || "None",
        vendorName: formData.vendorName || "None",
        ownerName: formData.ownerName || "None",
        contact1: formData.contact1 || "None",
        contact2: formData.contact2 || "None",
        whatsappNumber: formData?.whatsappNumber || "None",
        address: formData.address || "None",
        pincode: formData.pincode || "None",
        constructionMaterials: formData.constructionMaterials?.join(",") || "None",
        shopStatus: formData.shopStatus || "None",
        visitingCardFileName: formData.visitingCard?.name || undefined,
      };

      // 1. First submit the survey data to get signed URL if needed
      const response = await axios.post(
        "https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/add-survey",
        surveyData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { surveyId, visitingCardUploadUrl, isUpdate } = response.data;

      // 2. If there's a file to upload and we got a signed URL
      if (formData.visitingCard && visitingCardUploadUrl) {
        await axios.put(visitingCardUploadUrl, formData.visitingCard, {
          headers: {
            "Content-Type":
              formData.visitingCard.type || "application/octet-stream",
          },
          // onUploadProgress: (progressEvent) => {
          //   const percentCompleted = Math.round(
          //     (progressEvent.loaded * 100) / progressEvent.total
          //   );
          //   setUploadProgress(percentCompleted);
          // },
        });
      }

      // Refresh data and reset form
      await fetchSurveys();
      setFormData({
        visitorType: [],
        hasVisitingCard: false,
        visitingCard: null,
        description: "",
        vendorName: "",
        ownerName: "",
        contact1: "",
        contact2: "",
        address: "",
        pincode: "",
        whatsappNumber: "",
        constructionMaterials: [],
      });
      setFormStep(1);
      setShowUploadProgress(false);
      setShowModal(false);
      // setUploadProgress(0);

      const alertMessage = isUpdate
        ? "Survey updated successfully!"
        : "Survey submitted successfully!";
      setSubmittedData((prev) => [...prev, formData]); // Optionally store submitted data
      setShowModal(false); // Close modal after submission
      setTimeout(() => {
        const alertContainer = document.createElement("div");
        alertContainer.className = "alert alert-success";
        alertContainer.role = "alert";
        alertContainer.innerText = alertMessage;
        document.body.appendChild(alertContainer);

        setTimeout(() => {
          document.body.removeChild(alertContainer);
        }, 3000); // Remove alert after 3 seconds
      }, 0);
    } catch (error) {
      setShowUploadProgress(false);
      console.error("Submission error:", error);
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as any)?.message ||
        "Failed to submit survey";
      const alertContainer = document.createElement("div");
      alertContainer.className = "alert alert-danger";
      alertContainer.role = "alert";
      alertContainer.innerText = errorMessage;
      document.body.appendChild(alertContainer);

      setTimeout(() => {
        document.body.removeChild(alertContainer);
      }, 3000); // Remove alert after 3 seconds
    } finally {
      setShowUploadProgress(false);
      // setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setFormStep((prev) => Math.max(1, prev - 1));
  };

  const resetForm = () => {
    setFormData({ visitorType: [], hasVisitingCard: false });
    setFormStep(1);
    setShowModal(false);
  };

  const renderStepOne = () => (
    <>
      <Form.Group className="mb-4">
        <Form.Label>Vendor Type (Select at least one)</Form.Label>
        <Row>
          {[
            { value: "excavator", label: "Excavator" },
            { value: "mixture_machine", label: "Mixture Machine" },
            { value: "construction_material", label: "Construction Material" },
            { value: "cement_steel_store", label: "Cement & Steel Store" },
            { value: "local_supplier", label: "Local Supplier" },
            { value: "marbal_tile_store", label: "Marble & Tile Store" },
            { value: "concrete_product", label: "Concrete Product" },
            { value: "other", label: "Other" },
          ].map((type) => (
            <Col key={type.value} sm={6} className="mb-2">
              <Form.Check
                type="checkbox"
                id={`visitor-type-${type.value}`}
                label={type.label}
                name="visitorType"
                value={type.value}
                checked={formData.visitorType.includes(
                  type.value as VisitorType
                )}
                onChange={handleInputChange}
              />
            </Col>
          ))}
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="has-visiting-card"
          label="Has Visiting Card"
          name="hasVisitingCard"
          checked={formData.hasVisitingCard}
          onChange={handleInputChange}
        />
      </Form.Group>
    </>
  );

  const renderStepTwo = () => {
    const showConstructionMaterialOptions = formData.visitorType.includes(
      "construction_material"
    );

    if (formData.hasVisitingCard) {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Upload Visiting Card</Form.Label>
            <Form.Control
              type="file"
              name="visitingCard"
              accept="image/*,.pdf"
              onChange={handleInputChange}
            />
            <Form.Text muted>
              Please upload a clear image or PDF of the visiting card
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          {showConstructionMaterialOptions && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Select Construction Materials</Form.Label>
                <Row>
                  {["sand", "steel", "cement", "bricks", "crusher_metal"].map(
                    (material) => (
                      <Col xs={6} key={material}>
                        <Form.Check
                          type="checkbox"
                          id={`material-${material}`}
                          label={material.replace("_", " ").toUpperCase()}
                          name="constructionMaterials"
                          value={material}
                          checked={formData.constructionMaterials?.includes(
                            material as ConstructionMaterial
                          )}
                          onChange={handleInputChange}
                        />
                      </Col>
                    )
                  )}
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Shop Status</Form.Label>
                <Row>
                  {["with_shop", "without_shop", "manufacture_unit"].map(
                    (status) => (
                      <Col xs={12} sm={6} key={status}>
                        <Form.Check
                          type="radio"
                          id={`shop-status-${status}`}
                          label={status.replace("_", " ").toUpperCase()}
                          name="shopStatus"
                          value={status}
                          checked={formData.shopStatus === status}
                          onChange={handleInputChange}
                        />
                      </Col>
                    )
                  )}
                </Row>
              </Form.Group>
            </>
          )}
        </>
      );
    } else {
      return (
        <>
          <h5 className="mb-4">Manual Entry Details</h5>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control
                  type="text"
                  name="vendorName"
                  value={formData.vendorName || ""}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Owner Name</Form.Label>
                <Form.Control
                  type="text"
                  name="ownerName"
                  value={formData.ownerName || ""}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contact Number 1</Form.Label>
                <Form.Control
                  type="tel"
                  name="contact1"
                  value={formData.contact1 || ""}
                  onChange={handleInputChange}
                  required
                />
                <Form.Check
                  type="radio"
                  name="whatsappNumber"
                  label="Set as WhatsApp Number"
                  checked={formData.whatsappNumber === formData.contact1}
                  onChange={() => handleWhatsappChange(formData.contact1 || "")}
                  disabled={!formData.contact1}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contact Number 2 (Optional)</Form.Label>
                <Form.Control
                  type="tel"
                  name="contact2"
                  value={formData.contact2 || ""}
                  onChange={handleInputChange}
                />
                <Form.Check
                  type="radio"
                  name="whatsappNumber"
                  label="Set as WhatsApp Number"
                  checked={formData.whatsappNumber === formData.contact2}
                  onChange={() => handleWhatsappChange(formData.contact2 || "")}
                  disabled={!formData.contact2}
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

          <Form.Group className="mb-3">
            <Form.Label>Pincode</Form.Label>
            <Form.Control
              type="text"
              name="pincode"
              value={formData.pincode || ""}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
            />
          </Form.Group>

          {showConstructionMaterialOptions && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Select Construction Materials</Form.Label>
                <Row>
                  {["sand", "steel", "cement", "bricks", "crusher_metal"].map(
                    (material) => (
                      <Col xs={6} key={material}>
                        <Form.Check
                          type="checkbox"
                          id={`material-${material}`}
                          label={material.replace("_", " ").toUpperCase()}
                          name="constructionMaterials"
                          value={material}
                          checked={formData.constructionMaterials?.includes(
                            material as ConstructionMaterial
                          )}
                          onChange={handleInputChange}
                        />
                      </Col>
                    )
                  )}
                </Row>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Shop Status</Form.Label>
                <Row>
                  {["with_shop", "without_shop", "manufacture_unit"].map(
                    (status) => (
                      <Col xs={12} sm={6} key={status}>
                        <Form.Check
                          type="radio"
                          id={`shop-status-${status}`}
                          label={status.replace("_", " ").toUpperCase()}
                          name="shopStatus"
                          value={status}
                          checked={formData.shopStatus === status}
                          onChange={handleInputChange}
                        />
                      </Col>
                    )
                  )}
                </Row>
              </Form.Group>
            </>
          )}
        </>
      );
    }
  };

  const renderStepThree = () => {
    return (
      <>
        <h5 className="mb-4">Review Your Details</h5>
        <ul className="list-group">
          {/* Step 1 */}
          <li className="list-group-item list-group-item-primary">
            <strong>Step 1: Vendor Info</strong>
          </li>
          <li className="list-group-item">
            <strong>Vendor Type:</strong> {formData.visitorType.join(", ")}
          </li>
          <li className="list-group-item">
            <strong>Has Visiting Card:</strong>{" "}
            {formData.hasVisitingCard ? "Yes" : "No"}
          </li>

          {/* Step 2 */}
          <li className="list-group-item list-group-item-secondary mt-3">
            <strong>
              Step 2:{" "}
              {formData.hasVisitingCard
                ? "Visiting Card Details"
                : "Vendor Details"}
            </strong>
          </li>

          {formData.hasVisitingCard ? (
            <>
              <li className="list-group-item">
                <strong>Description:</strong> {formData.description}
              </li>

              {formData.visitorType.includes("construction_material") && (
                <>
                  <li className="list-group-item">
                    <strong>Construction Materials:</strong>{" "}
                    {formData.constructionMaterials?.join(", ") || "None"}
                  </li>
                  <li className="list-group-item">
                    <strong>Shop Status:</strong>{" "}
                    {formData.shopStatus?.replace("_", " ").toUpperCase() ||
                      "Not specified"}
                  </li>
                </>
              )}
            </>
          ) : (
            <>
              <li className="list-group-item">
                <strong>Vendor Name:</strong> {formData?.vendorName}
              </li>
              <li className="list-group-item">
                <strong>Owner Name:</strong> {formData?.ownerName}
              </li>
              <li className="list-group-item">
                <strong>Contact Number 1:</strong> {formData?.contact1}
              </li>
              <li className="list-group-item">
                <strong>Contact Number 2:</strong> {formData?.contact2 || "N/A"}
              </li>
              <li className="list-group-item">
                <strong>WhtsappNumber:</strong>{" "}
                {formData?.whatsappNumber || "N/A"}
              </li>
              <li className="list-group-item">
                <strong>Address:</strong> {formData?.address}
              </li>
              <li className="list-group-item">
                <strong>Pincode:</strong> {formData?.pincode}
              </li>

              {formData.visitorType.includes("construction_material") && (
                <>
                  <li className="list-group-item">
                    <strong>Construction Materials:</strong>{" "}
                    {formData.constructionMaterials?.join(", ") || "None"}
                  </li>
                  <li className="list-group-item">
                    <strong>Shop Status:</strong>{" "}
                    {formData.shopStatus?.replace("_", " ").toUpperCase() ||
                      "Not specified"}
                  </li>
                </>
              )}
            </>
          )}
        </ul>
      </>
    );
  };

  return (
    <>
      {userProfile?.isAdmin === "true" ? null : (
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="mb-3"
        >
          Add Vendor Details
        </Button>
      )}
      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>Vendor Survey</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {formStep === 1 && renderStepOne()}
            {formStep === 2 && renderStepTwo()}
            {formStep === 3 && renderStepThree()}
            <div className="form-buttons">
              {formStep > 1 && (
                <Button variant="secondary" onClick={handleBack}>
                  <ArrowLeftIcon /> Back
                </Button>
              )}
              <Button
                variant="primary"
                type="submit"
                className={"ml-2"}
                disabled={showUploadProgress}
              >
                {formStep === 3 ? "Submit" : "Next"}
                {showUploadProgress && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default VisitorManagement;
