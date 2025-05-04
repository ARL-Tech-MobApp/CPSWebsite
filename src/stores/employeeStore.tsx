import { create } from 'zustand';
import axios from 'axios';

interface Employee {
  id: number;
  fullName: string;
  dob: string;
  position: string;
  department: string;
  email: string;
  phonenumber: string;
  address: string;
  joiningdate: string;
  salary: string;
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

  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));