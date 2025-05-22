// src/hooks/useWorksheets.ts
import { useState, useEffect,useCallback } from "react";
import { useAuthStore } from "../../../stores/useAuthStore";
import { Worksheet } from "../types/worksheet";
import {
  fetchWorksheetsApi,
  addOrUpdateWorksheetApi,
  deleteWorksheetApi,
} from "../../../services/worksheetService";

export function useWorksheets() {
    const { userProfile } = useAuthStore();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingWorksheet, setEditingWorksheet] = useState<Worksheet | null>(null);
  const [formData, setFormData] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState(false);
  const [viewContent, setViewContent] = useState("");

  const fetchWorksheets = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const sortedWorksheets = await fetchWorksheetsApi(userProfile);
      setWorksheets(sortedWorksheets);
    } catch (err) {
      console.error("Error fetching worksheets:", err);
      setError("Failed to load worksheets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [userProfile]); // only re-create if userProfile changes


  const addOrUpdateWorksheet = async (worksheetData: Partial<Worksheet>) => {
    setIsLoading(true);
    setError("");
    try {
      await addOrUpdateWorksheetApi(worksheetData);
      await fetchWorksheets();
    } catch (err) {
      console.error("Error saving worksheet:", err);
      setError("Failed to save worksheet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorksheet = async (worksheetId: string) => {
    if (!window.confirm("Are you sure you want to delete this worksheet?")) return;

    setIsLoading(true);
    setError("");
    try {
      await deleteWorksheetApi(worksheetId);
      await fetchWorksheets();
    } catch (err) {
      console.error("Error deleting worksheet:", err);
      setError("Failed to delete worksheet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      fetchWorksheets();
    }
  }, [userProfile, fetchWorksheets]); // now include fetchWorksheets

  useEffect(() => {
    if (showModal) setCurrentDateTime(new Date().toLocaleString());
  }, [showModal]);

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
    await addOrUpdateWorksheet({
      id: editingWorksheet?.id,
      employeeId: userProfile?.id,
      content: formData,
      time: new Date().toISOString(),
    });
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    await deleteWorksheet(id);
  };

  const handleChange = (value: string) => {
    setFormData(value);
  };
  


  const handleViewMore = (content: string) => {
    setViewContent(content);
    setViewModal(true);
  };

  return {
    worksheets,
    isLoading,
    error,
    setError,
    fetchWorksheets,
    addOrUpdateWorksheet,
    deleteWorksheet,
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
  };
}
