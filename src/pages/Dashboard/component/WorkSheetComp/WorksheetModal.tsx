import React, { useRef } from "react";
import { Modal, Button, Badge, Spinner } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ModalProps } from "../../types/worksheet";

// Capitalize Button Handler
const CapitalizeHandler = (quillRef: any) => {
  const editor = quillRef.current.getEditor();
  const text = editor.getText();
  const capitalized = text.toUpperCase();
  editor.setText(capitalized);
};

// Custom Toolbar
const CustomToolbar = ({ quillRef }: { quillRef: any }) => (
  <div id="toolbar">
    <select className="ql-font" />
    <select className="ql-size" />
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <select className="ql-color" />
    <select className="ql-background" />
    <button className="ql-align" value="" />
    <button className="ql-align" value="center" />
    <button className="ql-align" value="right" />
    <button className="ql-align" value="justify" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-clean" />
    <button onClick={() => CapitalizeHandler(quillRef)}>Aa</button>
  </div>
);

const modules = (quillRef: any) => ({
  toolbar: {
    container: "#toolbar",
  },
});

const formats = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "color",
  "background",
  "align",
  "list",
  "bullet",
];

const WorksheetModal: React.FC<ModalProps> = ({
  show,
  onClose,
  onSubmit,
  formData,
  onChange,
  currentDateTime,
  editingWorksheet,
  isLoading,
}) => {
  const quillRef = useRef<any>(null);

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editingWorksheet ? "Edit Worksheet" : "New Worksheet"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Badge bg="info" className="mb-3">
          🕒 {currentDateTime}
        </Badge>

        <CustomToolbar quillRef={quillRef} />

        <ReactQuill
          ref={quillRef}
          value={formData}
          onChange={onChange}
          modules={modules(quillRef)}
          formats={formats}
          placeholder="Type like Excel – style, align, format..."
          style={{ height: "250px", marginBottom: "50px" }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="success" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : editingWorksheet ? "Update" : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorksheetModal;
