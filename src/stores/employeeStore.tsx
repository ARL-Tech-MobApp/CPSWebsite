import { create } from 'zustand';
import axios from 'axios';

interface Employee {
  id?: string;
  empId?: string;
  fullName: string;
  dob: string;
  position: string;
  department: string;
  email: string;
  phoneNumber: string;
  address: string;
  joiningDate: string;
  salary: string;
  city: string;
}

interface EmployeeState {
  employees: Employee[];
  totalCount: number;
  loading: boolean;
  currentPage: number;
  rowsPerPage: number;
  searchQuery: string;
  fetchEmployees: (page?: number, limit?: number, search?: string) => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Omit<Employee, 'id'>) => Promise<void>;
  deleteEmployee: (employeeId: any) => Promise<void>;
  setCurrentPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  totalCount: 0,
  loading: false,
  currentPage: 1,
  rowsPerPage: 10,
  searchQuery: '',

  fetchEmployees: async (page = get().currentPage, limit = get().rowsPerPage, search = get().searchQuery) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/get-all-employees`,
        {
          params: { page, limit, search },
        }
      );
      set({
        employees: response.data.employees,
        totalCount: response.data.totalCount,
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      set({ loading: false });
    }
  },

  addEmployee: async (employee) => {
    try {
      set({ loading: true });
      const response = await axios.post(
        'https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/register',
        employee
      );
      // Refresh the employee list after adding
      await get().fetchEmployees(1); // Reset to first page
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  updateEmployee: async (id,employee) => {
    try {
      set({ loading: true });
      await axios.post(
        `https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/update-profile?employeeId=${id}`,
        employee
      );
      // Refresh the employee list after adding
      await get().fetchEmployees(1); // Reset to first page
    } catch (error) {
      console.error("Error update employee:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  deleteEmployee: async (employeeId: any) => {
    set({ loading: true});
  
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(
          `https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/delete-employee`,employeeId
        );
        set((state) => ({
          employees: state.employees.filter((employee) => employee.id !== employeeId),
          loading: false,
        }));
  
        alert("employee deleted successfully.");
      } catch (error) {
        set({loading : false });
        alert("Failed to delete survey.");
        throw error;
      }
    } else {
      set({ loading: false }); // In case user cancels
    }
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));