import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { loginEmployee } from "../services/authService";
import { LoginFormData } from "../types/authType";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setApiError("");

    try {
      const { accessToken, refreshToken } = await loginEmployee(data);

      if (accessToken) {
        await setTokens(accessToken, refreshToken);
        setIsSuccess(true);
        navigate("/employee-portals");
      }
    } catch (error: any) {
      setApiError(error?.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    apiError,
    isSuccess,
    showPassword,
    togglePasswordVisibility,
    onSubmit,
  };
};
