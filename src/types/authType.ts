export interface LoginFormData {
    employeeId: string;
    password: string;
  }
  
  export interface ApiResponse {
    refreshToken: string;
    accessToken: string;
    message?: string;
    user?: {
      id: string;
      fullName: string;
      department: string;
      position: string;
      email: string;
    };
  }
  