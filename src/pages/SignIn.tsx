import React from "react";
import { useForm, SubmitHandler,Controller  } from "react-hook-form";
import { Form, Input, Button, Typography, Alert } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, LoginOutlined } from "@ant-design/icons";
import { useLogin } from "../hooks/useLogin";
import { LoginFormData } from "../types/authType";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const SignIn: React.FC = () => {
  const {
    isLoading,
    apiError,
    isSuccess,
    onSubmit,
  } = useLogin();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }, // you can keep errors but won't be used for validation now
  } = useForm<LoginFormData>();

  const handleFormSubmit: SubmitHandler<LoginFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #e0f7fa, #ffffff)",
        padding: "2rem",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          maxWidth: "1000px",
          width: "100%",
          background: "#fff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          borderRadius: 20,
          overflow: "hidden",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {/* Left Side – Sign In */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            flex: "1 1 400px",
            padding: "60px 40px",
            background: "rgba(255, 255, 255, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <Title level={3} style={{ marginBottom: 10 }}>Welcome Back 👋</Title>
          <Text type="secondary" style={{ marginBottom: 30 }}>
            Sign in with your employee credentials
          </Text>

          {isSuccess ? (
            <Alert message="Login successful! Redirecting..." type="success" showIcon />
          ) : (
            <Form
              layout="vertical"
              onFinish={handleSubmit(handleFormSubmit)}
              autoComplete="off"
              style={{ maxWidth: 400, width: "100%" }}
            >
              {apiError && (
                <Alert
                  message={apiError}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

<Form.Item
  label={<Text strong>Employee ID</Text>}
  validateStatus={errors.employeeId ? "error" : ""}
  help={errors.employeeId?.message}
>
  <Controller
    name="employeeId"
    control={control}
    rules={{ required: "Employee ID is required" }}
    render={({ field }) => (
      <Input
        {...field}
        size="large"
        placeholder="e.g. EMP12345"
        style={{ borderRadius: 10 }}
      />
    )}
  />
</Form.Item>


<Form.Item
  label={<Text strong>Password</Text>}
  validateStatus={errors.password ? "error" : ""}
  help={errors.password?.message}
>
  <Controller
    name="password"
    control={control}
    rules={{
      required: "Password is required",
      minLength: { value: 6, message: "At least 6 characters" },
    }}
    render={({ field }) => (
      <Input.Password
        {...field}
        size="large"
        placeholder="Enter your password"
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        style={{ borderRadius: 10 }}
      />
    )}
  />
</Form.Item>


              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={isLoading}
                style={{
                  marginTop: 20,
                  borderRadius: 10,
                  background: "linear-gradient(90deg, #1890ff, #40a9ff)",
                  fontWeight: 600,
                }}
              >
                Sign In
              </Button>
            </Form>
          )}
        </motion.div>

        {/* Right Side – Icon & Message */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            flex: "1 1 400px",
            background: "linear-gradient(to bottom right, #1890ff, #40a9ff)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            minWidth: 0,
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            style={{
              background: "#fff",
              borderRadius: "50%",
              width: 120,
              height: 120,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              marginBottom: 30,
            }}
          >
            <LoginOutlined style={{ fontSize: 50, color: "#1890ff" }} />
          </motion.div>
          <Title level={2} style={{ color: "#fff", textAlign: "center" }}>
            Employee Portal
          </Title>
          <Text style={{ color: "#e0f0ff", fontSize: 16, textAlign: "center", marginTop: 12 }}>
            Access your dashboard, tools, and communication hub in one place.
          </Text>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SignIn;
