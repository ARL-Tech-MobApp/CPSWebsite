import { useState, useEffect } from "react";
import { useEmployeeStore } from "../../../stores/employeeStore";
import { useSurveyStore } from "../../../stores/surveyStore";
import { useAuthStore } from "../../../stores/useAuthStore";
import moment from "moment";
import { EmployeeFormData, EmployeeDetails,Employee } from "../types/employee";
import { VisitFormData, Survey,VisitorType,ConstructionMaterial,ShopStatus} from "../types/survey";
import { adminTabs, employeeTabs } from "../config/tabsConfig";
import { Expense } from "../types";

export const useDashboardLogic = () => {
  const { userProfile} = useAuthStore();
  const { employees, fetchEmployees, deleteEmployee } = useEmployeeStore();
  const { surveys, deleteSurvey, fetchSurveys, lastKey } = useSurveyStore();
  const [isEditMode, setIsEditMode] = useState(false);
  // State management
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewType, setViewType] = useState<"employee" | "survey" | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [touchedSurveyIds, setTouchedSurveyIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>(
    userProfile?.isAdmin === "true" ? "#nav-home" : "#nav-reports"
  );
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);


  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState<{
    details: EmployeeDetails;
    status: boolean;
  }>({ details: {}, status: false });

  // Form states
  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: "",
    position: "",
    department: "",
    dob: "",
    email: "",
    joiningDate: new Date().toISOString().split("T")[0],
  });
  
  const [visitorFormData, setVisitorFormData] = useState<VisitFormData>({
    visitorType: [],
    hasVisitingCard: false,
  });

  // Data fetching
  useEffect(() => {
    fetchEmployees();
    fetchSurveys();
  }, [fetchEmployees, fetchSurveys]);

  // Handlers
  const handleEdit = (employee: Employee) => {
    setFormData({
      ...employee,
      id: employee.id,
      joiningDate: moment(employee.joiningDate, "dddd, DD MMM [at] hh:mm A").format("YYYY-MM-DD"),
    });
    setShowEmployeeModal(true);
  };

  const handleView = (item: Employee | Survey) => {
    if ("fullName" in item) {
      setViewType("employee");
      setFormData(item);
    } else {
      setViewType("survey");
      setVisitorFormData({
                          // Add required VisitFormData fields
                          hasVisitingCard: !!item.visitingCardUrl, // Convert to boolean
                          visitingCard: null, // Default value
                          // Spread survey item properties
                          ...item,
                          // Convert string fields to arrays
                          visitorType: item.visitorType?.split(",") as VisitorType[],
                          constructionMaterials: item.constructionMaterials?.split(",") as ConstructionMaterial[],
                          // Ensure shopStatus is of type ShopStatus
                          shopStatus: item.shopStatus !== undefined ? (item.shopStatus as ShopStatus) : undefined,
                        });
    }
    setShowViewModal(true);
  };

  const handleEditVisitor = (survey: Survey) => {
    markAsTouched(survey.id);
    setVisitorFormData({
          hasVisitingCard: !!survey.visitingCardUrl,
          visitingCard: null,
          ...survey,
          visitorType: survey.visitorType?.split(",") as VisitorType[],
          constructionMaterials: survey.constructionMaterials?.split(",") as ConstructionMaterial[],
          shopStatus: survey.shopStatus !== undefined ? (survey.shopStatus as ShopStatus) : undefined,
        });
    setShowVisitorModal(true);
  };
  const markAsTouched = (id: string) => {
    setTouchedSurveyIds(prev => Array.from(new Set([...prev, id])));
  };

    // Add expense handlers
    const handleEditExpense = (expense: Expense) => {
      setSelectedExpense(expense);
      setShowExpenseModal(true);
    };
  
    const deleteExpense = (id: string) => {
      setExpenses(prev => prev.filter(e => e.id !== id));
    };
  
console.log("userProfile:", userProfile);
  // Computed values
  const tabsToRender = userProfile?.isAdmin === "true" ? adminTabs : employeeTabs;
  const profileFields = [
    { label: "Employee ID", value: userProfile?.id },
    { label: "Full Name", value: userProfile?.fullName },
    { label: "Position", value: userProfile?.position },
    { label: "Department", value: userProfile?.department },
    // { label: "Designation", value: userProfile?.designation },
    { label: "City", value: userProfile?.city },
  ];

  

  return {
    // State
    userProfile,
    employees,
    surveys,
    formData,
    visitorFormData,
    showEmployeeModal,
    showVisitorModal,
    showViewModal,
    viewType,
    selectedImage,
    touchedSurveyIds,
    activeTab,
    showEmployeeDetailsModal,
    profileFields,
    tabsToRender,
    isEditMode,
    expenses,
   
    
    // Handlers
    setFormData,
    setVisitorFormData,
    setShowEmployeeModal,
    setShowVisitorModal,
    setShowViewModal,
    setSelectedImage,
    setIsEditMode,
    setActiveTab,
    setShowEmployeeDetailsModal,
    handleEdit,
    handleEditVisitor,
    handleView,
    deleteEmployee,
    deleteSurvey,
    markAsTouched,
    handleEditExpense,
    deleteExpense
  };
};