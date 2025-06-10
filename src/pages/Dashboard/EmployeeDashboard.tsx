import React, { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Badge,
  Avatar,
  Switch,
  FloatButton,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DollarOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useDashboardLogic } from "./hooks/useDashboardLogic";
import { tabContentMap } from "./config/tabContentConfig";
import TabContentRenderer from "./config/TabContentRenderer";
import EmployeeDetailsModal from "./component/EmployeeDetailsModal";
import ImagePreviewModal from "./component/ImagePreviewModal";
import ViewShow from "../../components/ViewShow";
import FooterBar from "../../components/Footer";
import "../../styles/EmployeeDashboard.css";
import { useAuthStore } from "../../stores/useAuthStore";

const { Header, Sider, Footer } = Layout;

const EmployeeDashboard: React.FC = () => {
  const { logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [theme, setTheme] = useState("light");

  const {
    userProfile,
    employees,
    surveys,
    formData,
    showEmployeeModal,
    showVisitorModal,
    isEditMode,
    visitorFormData,
    showViewModal,
    touchedSurveyIds,
    viewType,
    selectedImage,
    activeTab,
    showEmployeeDetailsModal,
    profileFields,
    tabsToRender,
    setFormData,
    setVisitorFormData,
    setIsEditMode,
    setShowEmployeeModal,
    setShowVisitorModal,
    setActiveTab,
    setShowEmployeeDetailsModal,
    setSelectedImage,
    handleView,
    handleEdit,
    handleEditVisitor,
    deleteEmployee,
    deleteSurvey,
    ...otherHandlers
  } = useDashboardLogic();

  useEffect(() => {
    const savedTheme = localStorage.getItem("dashboardTheme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("dashboardTheme", newTheme);
  };

  const renderMenu = () => (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[activeTab]}
      onClick={({ key }) => setActiveTab(key)}
      items={tabsToRender.map((tab) => ({
        key: tab.target,
        icon: getMenuIcon(tab.target),
        label: tab.label,
      }))}
    />
  );

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Fixed Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        width={220}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        <div
          className="logo"
          style={{ color: "white", padding: 20, fontWeight: "bold" }}
        >
          BhawanCare
        </div>
        {renderMenu()}
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <div
          style={{
            padding: 16,
            background: "#001529",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          BhawanCare
        </div>
        {renderMenu()}
      </Drawer>

      {/* Main Layout - shifted right to avoid sidebar */}
      <Layout
        style={{
          marginLeft: collapsed ? 0 : 220,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Fixed Header */}
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: collapsed ? 0 : 220,
            right: 0,
            zIndex: 1001,
            backgroundColor: theme === "dark" ? "#1f1f1f" : "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 64,
            boxShadow: "0 2px 8px #f0f1f2",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (window.innerWidth < 768) setDrawerVisible(true);
                else setCollapsed(!collapsed);
              }}
            />
            <span style={{ fontWeight: "bold", fontSize: 18, color: "#1890ff" }}>
              Welcome, {userProfile?.fullName || "User"}!
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Badge count={3} size="small">
              <BellOutlined
                style={{ fontSize: 20, color: theme === "dark" ? "#fff" : "#555" }}
              />
            </Badge>
            <Switch
              checkedChildren="🌙"
              unCheckedChildren="☀️"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <Avatar src="/default-avatar.png" />
            <Button type="link" icon={<LogoutOutlined />} onClick={async () => {
                    try {
                      await logout();
                    } catch (error) {
                      console.error("Logout failed:", error);
                    }
                  }}>
              Logout
            </Button>
          </div>
        </Header>

        {/* Scrollable Content + Footer container */}
        <div
          style={{
            marginTop: 64, // header height
            height: "calc(100vh - 64px)",
            overflowY: "auto",
            background: theme === "dark" ? "#1f1f1f" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            padding: "24px 16px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Content */}
          <div style={{ flex: "1 1 auto" }}>
            {tabsToRender.map((tab) => {
              if (tab.target === activeTab) {
                const config = tabContentMap[tab.target];
                if (!config) return <div key={tab.target}>No configuration found</div>;
                const data =
                  config.tableConfig?.dataKey === "employees" ? employees : surveys;
                return (
                  <TabContentRenderer
                    key={tab.target}
                    tabTarget={tab.target}
                    config={config}
                    data={data}
                    handlers={{
                      formData,
                      visitorFormData,
                      setFormData,
                      setVisitorFormData,
                      showEmployeeModal,
                      showVisitorModal,
                      setShowEmployeeModal,
                      setShowVisitorModal,
                      isEditMode,
                      setIsEditMode,
                      handleView,
                      handleEdit,
                      handleEditVisitor,
                      deleteEmployee,
                      deleteSurvey,
                      userProfile,
                      touchedSurveyIds,
                      setShowEmployeeDetailsModal,
                      setSelectedImage,
                    }}
                  />
                );
              }
              return null;
            })}
          </div>

          {/* Footer */}
          <Footer style={{ textAlign: "center", flexShrink: 0 }}>
            <FooterBar />
          </Footer>
        </div>
      </Layout>

      {/* Scroll to Top Button */}
      <FloatButton.BackTop visibilityHeight={200} />

      {/* Modals */}
      <ViewShow
        showViewModal={showViewModal}
        setShowViewModal={otherHandlers.setShowViewModal}
        formData={formData}
        visitorFormData={visitorFormData}
        viewType={viewType}
      />
      <EmployeeDetailsModal
        show={showEmployeeDetailsModal.status}
        details={showEmployeeDetailsModal.details}
        onClose={() => setShowEmployeeDetailsModal({ status: false, details: {} })}
      />
      <ImagePreviewModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </Layout> 
  );
};

const getMenuIcon = (target: string) => {
  if (target.includes("home")) return <UserOutlined />;
  if (target.includes("report")) return <FileTextOutlined />;
  if (target.includes("worksheet")) return <CalendarOutlined />;
  if (target.includes("expense")) return <DollarOutlined />;
  return <UserOutlined />;
};

export default EmployeeDashboard;
