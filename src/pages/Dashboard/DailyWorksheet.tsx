import React from "react";
import { Button } from "react-bootstrap";
import WorksheetList from "./component/WorkSheetComp/WorksheetList";
import WorksheetModal from "./component/WorkSheetComp/WorksheetModal";
import WorksheetViewModal from "./component/WorkSheetComp/WorksheetViewModal";
import { useWorksheets } from "./hooks/useWorksheets";

const DailyWorksheet: React.FC = () => {
  const {
    worksheets,
    isLoading,
    error,
    setError,
    showModal,
    editingWorksheet,
    formData,
    currentDateTime,
    currentPage,
    viewModal,
    viewContent,
    setCurrentPage,
    setViewModal,
    handleShowModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    handleChange,
    handleViewMore,
  } = useWorksheets();

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Daily Worksheet</h3>
        <Button
          variant="success"
          onClick={() => handleShowModal()}
          disabled={isLoading}
        >
          New Worksheet
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger mt-2" role="alert">
          {error} <button onClick={() => setError("")} className="btn-close" />
        </div>
      )}

      <WorksheetList
        worksheets={worksheets}
        isLoading={isLoading}
        onEdit={handleShowModal}
        onDelete={handleDelete}
        onViewMore={handleViewMore}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <WorksheetModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        currentDateTime={currentDateTime}
        editingWorksheet={editingWorksheet}
        isLoading={isLoading}
      />

      <WorksheetViewModal
        show={viewModal}
        onClose={() => setViewModal(false)}
        content={viewContent}
      />
    </div>
  );
};

export default DailyWorksheet;
