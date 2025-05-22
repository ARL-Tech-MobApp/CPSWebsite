import { Api } from "../api/api";
import { LoginFormData, ApiResponse } from "../types/authType";

export const loginEmployee = async (data: LoginFormData): Promise<ApiResponse> => {
    console.log("Login data:", data);
  const response = await Api.post<ApiResponse>("Prod/login", {
    id: data.employeeId,
    password: data.password,
  });
  return response.data;
};
 