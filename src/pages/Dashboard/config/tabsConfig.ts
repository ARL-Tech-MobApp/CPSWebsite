import { TabConfig } from "../types/common";

export const adminTabs: TabConfig[] = [
  {
    target: "profile",
    label: "Profile",
     active: false, role: "admin"
  },
  
  { label: "Employee Details", target: "#nav-home", active: true, role: "admin" },
  { label: "View Report", target: "#nav-reports", active: false, role: "admin" },
  { label: "Daily Work Done", target: "#nav-worksheet", active: false, role: "admin" },
  { label: "Assign Task", target: "#nav-tasks", active: false, role: "admin" },
  { label: "Check Expenses", target: "#nav-expenses", active: false, role: "admin" },
  { label: "Attendance", target: "#nav-attendance", active: false, role: "admin" },
  { label: "Holiday Calendar", target: "#nav-calendar", active: false, role: "admin" },
  { label: "Sanction Leave", target: "#nav-leaves", active: false, role: "admin" },
  { label: "Rating", target: "#nav-ratings", active: false, role: "admin" },
  { label: "Employee Handbook", target: "#nav-handbook", active: false, role: "admin" },
  { label: "Salary Slip", target: "#nav-salaries", active: false, role: "admin" },
];

export const employeeTabs: TabConfig[] = [
  {
    target: "profile",
    label: "Profile",
     active: false, role: "employee"
  },
  
  { label: "Submit Report", target: "#nav-reports", active: true, role: "employee" },
  { label: "Daily Work Done", target: "#nav-worksheet", active: false, role: "employee" },
  { label: "My Task", target: "#nav-tasks", active: false, role: "employee" },
  { label: "Claim Expenses", target: "#nav-expenses", active: false, role: "employee" },
  { label: "My Attendance", target: "#nav-attendance", active: false, role: "employee" },
  { label: "Holiday Calendar", target: "#nav-calendar", active: false, role: "employee" },
  { label: "Apply for Leave", target: "#nav-leaves", active: false, role: "employee" },
  { label: "Rating", target: "#nav-ratings", active: false, role: "employee" },
  { label: "Employee Handbook", target: "#nav-handbook", active: false, role: "employee" },
  { label: "Salary Slip", target: "#nav-salaries", active: false, role: "employee" },
]; 
