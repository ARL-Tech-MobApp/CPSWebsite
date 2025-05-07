import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Modal,
  Button,
  Form,
  Badge,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { useAuthStore } from "../stores/useAuthStore";
import moment from "moment";

interface Worksheet {
  id: string;
  content: string;
  time: string;
  employeeId: string;
  createdAt?: string;
  updatedAt?: string;
}

const ITEMS_PER_PAGE = 5;
const API_BASE_URL =
  "https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod";

const DailyWorksheetApp: React.FC = () => {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingWorksheet, setEditingWorksheet] = useState<Worksheet | null>(
    null
  );
  const [formData, setFormData] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [viewContent, setViewContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { userProfile, profileLoading, logout } = useAuthStore();

  console.log("userProfile", userProfile);

  useEffect(() => {
    fetchWorksheets();
  }, [userProfile]);

  useEffect(() => {
    if (showModal) {
      setCurrentDateTime(new Date().toLocaleString());
    }
  }, [showModal]);

  const fetchWorksheets = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        userProfile?.isAdmin === "true"
          ? `${API_BASE_URL}/get-worksheet`
          : `${API_BASE_URL}/get-worksheets-by-employee?employeeId=${userProfile?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch worksheets");
      const data = await response.json();
      const worksheets = data.worksheets || [];
  
      // ✅ Sort by time (newest first)
      const sortedWorksheets = worksheets.sort((a: { time: moment.MomentInput; }, b: { time: moment.MomentInput; }) =>
        moment(b.time).valueOf() - moment(a.time).valueOf()
      );
  
      setWorksheets(sortedWorksheets);
    } catch (err) {
      console.error("Error fetching worksheets:", err);
      setError("Failed to load worksheets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowModal = (worksheet: Worksheet | null = null) => {
    setEditingWorksheet(worksheet);
    setFormData(worksheet ? worksheet.content : "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWorksheet(null);
    setFormData("");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const worksheetData = {
        id: editingWorksheet?.id,
        employeeId: userProfile?.id,
        content: formData,
        time: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/add-worksheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(worksheetData),
      });

      if (!response.ok) throw new Error("Failed to save worksheet");

      await fetchWorksheets(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      console.error("Error saving worksheet:", err);
      setError("Failed to save worksheet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (worksheetId: string) => {
    if (!window.confirm("Are you sure you want to delete this worksheet?"))
      return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/delete-worksheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ worksheetId }),
      });

      if (!response.ok) throw new Error("Failed to delete worksheet");

      await fetchWorksheets(); // Refresh the list
    } catch (err) {
      console.error("Error deleting worksheet:", err);
      setError("Failed to delete worksheet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(e.target.value);
  };

  const totalPages = Math.ceil(worksheets.length / ITEMS_PER_PAGE);
  const paginatedItems = worksheets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewMore = (content: string) => {
    setViewContent(content);
    setViewModal(true);
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">🗒️ Daily Worksheet</h4>

      {error && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      <Button
        variant="primary"
        onClick={() => handleShowModal(null)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner animation="border" size="sm" />
        ) : (
          "+ Add Worksheet"
        )}
      </Button>

      {isLoading && !worksheets.length ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
          <p>Loading worksheets...</p>
        </div>
      ) : (
        <>
          <ul className="list-group mt-4">
            {paginatedItems.map((item, index) => (
              <li key={item.id} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="fw-bold">
                      {new Date(item.time).toLocaleString()}
                    </div>
                    <div className="container p-2">
                      {item.content.length > 100
                        ? `${item.content.substring(0, 100)}...`
                        : item.content}
                    </div>

                    <div className="text-muted small mt-1">
                      By: {item.employeeId}
                    </div>
                  </div>
                  <div className="text-end">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowModal(item)}
                      disabled={isLoading}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(item.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleViewMore(item.content)}
                    >
                      View More
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination className="mt-3">
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i}
                  active={i + 1 === currentPage}
                  onClick={() => setCurrentPage(i + 1)}
                  disabled={isLoading}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingWorksheet ? "Edit Worksheet" : "New Worksheet"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Badge bg="info" className="mb-2">
            🕒 {currentDateTime}
          </Badge>
          <Form.Group controlId="content">
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              style={{ resize: "both", width: "100%" }}
              value={formData}
              onChange={handleChange}
              placeholder="Enter your daily update here..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : editingWorksheet ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View More Modal */}
      <Modal show={viewModal} onHide={() => setViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Worksheet Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="container"
            style={{
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <p style={{ whiteSpace: "pre-line" }}>{viewContent}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DailyWorksheetApp;
