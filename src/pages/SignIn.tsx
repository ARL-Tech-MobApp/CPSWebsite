import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios, { AxiosError, AxiosResponse } from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { sendEmployeeCredentials } from "../utils/helper";

interface LoginFormData {
  employeeId: string;
  password: string;
}

interface ApiResponse {
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

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setIsLoading(true);
    setApiError("");

    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        "https://fxosysucf1.execute-api.ap-south-1.amazonaws.com/Prod/login",
        {
          id: data.employeeId,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Replace with actual token names from your API response
      const accessToken = response?.data?.accessToken;
      const refreshToken = response?.data?.refreshToken; // Replace with real one if available

      if (accessToken) {
        await setTokens(accessToken, refreshToken);
        setIsSuccess(true);
      }

      console.log("Login successful:", response.data);
      setIsSuccess(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setApiError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-sm p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4 text-primary">Employee Sign In</h2>

          {isSuccess ? (
            <div className="alert alert-success text-center">
              Login successful! Redirecting...
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              {apiError && (
                <div className="alert alert-danger mb-3">{apiError}</div>
              )}

              <div className="mb-3">
                <label htmlFor="employeeId" className="form-label">
                  Employee ID
                </label>
                <input
                  id="employeeId"
                  type="text"
                  className={`form-control ${
                    errors.employeeId ? "is-invalid" : ""
                  }`}
                  {...register("employeeId", {
                    required: "Employee ID is required",
                    pattern: {
                      value: /^EMP\d{5,}$/,
                      message: "ID must start with EMP followed by numbers",
                    },
                  })}
                  placeholder="e.g.EMP12345"
                />
                {errors.employeeId && (
                  <div className="invalid-feedback">
                    {errors.employeeId.message}
                  </div>
                )}
              </div>

              <div className="mb-4 position-relative">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="Enter Your Password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    ></i>
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
