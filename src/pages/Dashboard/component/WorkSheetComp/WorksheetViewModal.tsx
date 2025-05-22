import React from "react";
import { Modal, Button } from "react-bootstrap";
import { ViewModalProps } from "../../types/worksheet";



const WorksheetViewModal: React.FC<ViewModalProps> = ({ show, onClose, content }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Worksheet Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <p style={{ whiteSpace: "pre-line" }}  dangerouslySetInnerHTML={{
    __html: content,
  }}/>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
);

export default WorksheetViewModal;
