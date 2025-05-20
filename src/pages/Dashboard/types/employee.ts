export interface EmployeeFormData {
  id?: string;
  empId?: string;
  fullName: string;
  position: string;
  department: string;
  dob: string;
  email: string;
  phone?: string;
  address?: string;
  joiningDate: string;
  salary?: string;
  cities?: string[];
  city?: string;
}

export interface Employee {
  id?: string;
  fullName: string;
  dob: string;
  position: string;
  department: string;
  phoneNumber: string;
  address: string;
  joiningDate: string;
  salary: string;
  email: string;
  createdAt?: string;
  city: string;
  
}

export interface EmployeeDetails {
  fullName?: string;
  email?: string;
  department?: string;
  position?: string;
  phoneNumber?: string;
  city?: string;
}

export  interface EmployeeDetailsModalProps {
  show: boolean;
  details: EmployeeDetails;
  onClose: () => void;
}

export interface ProfileSectionProps {
  profileFields: Array<{ label: string; value?: string }>;
}