import  GenericTable from "../../../components/GenericTable";
import { getEmployeeColumns } from "./employeeColumns";
import { getSurveyColumns } from "./surveyColumns";
import EmployeeManagement from "../../../components/EmployeeManagement";
import VisitorManagement from "../../../components/VisitorManagement";
import DailyWorksheet from "../DailyWorksheet";
import ExpensesPage from "../ExpensesPage";
import ProfileTabContent from "../component/ProfileTabContent";
import MyAttendance from "../MyAttendance";
import ApplyLeave from "../ApplyLeave";
import HolidayCalendar from "../HolidayCalendar";
import HandBook from "../HandBook";
import Task from "../Task";


export type TabContentConfig = {
    component: React.ComponentType<any>;
    formComponent?: React.ComponentType<{
      formData: any;
      setFormData: React.Dispatch<React.SetStateAction<any>>;
      showModal: boolean;
      setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
      isEditMode?: boolean;
      setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
    }>;
    tableConfig?: {
      columns: any;
      dataKey: string;
      heading: string;
    };
  };

export const tabContentMap: Record<string, TabContentConfig> = {
  "#nav-home": {
    component: GenericTable,
    formComponent: EmployeeManagement,
    tableConfig: {
      columns: getEmployeeColumns,
      dataKey: "employees",
      heading: "Employee Details"
    }
  },
  "#nav-reports": {
    component: GenericTable,
    formComponent: VisitorManagement,
    tableConfig: {
      columns: getSurveyColumns,
      dataKey: "surveys",
      heading: "Survey Details"
    }
  },
  "#nav-worksheet": {
    component: DailyWorksheet
  },
  "#nav-expenses": {
    component:  ExpensesPage,
    
  },
  "profile": {
    component: ProfileTabContent,
  },
  "#nav-attendance": {
    component: MyAttendance,
  },
  "#nav-leaves": {
    component:ApplyLeave,
  },
  "#nav-calendar": {
    component:HolidayCalendar,
  },
  "#nav-handbook": {
    component:HandBook,
  },
  "#nav-tasks": {
    component:Task,
  },
};