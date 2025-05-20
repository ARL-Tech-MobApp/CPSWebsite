import React from "react";
import { useDashboardLogic } from "./hooks/useDashboardLogic";
import { tabContentMap } from "./config/tabContentConfig";
import ProfileSection from "./component/ProfileSection";
import DashboardTabs from "./component/DashboardTabs";
import EmployeeDetailsModal from "./component/EmployeeDetailsModal";
import Footer from "../../components/Footer";
import Header from "../../components/Navbar";
import ViewShow from "../../components/ViewShow";
import RandomQuote from "../../components/RandomQuote/RandomQuote";
import TabContentRenderer from "./config/TabContentRenderer";
import ImagePreviewModal from "./component/ImagePreviewModal";
import BirthdayAnniversarySection from "./component/BirthdayAnniversarySection";

const EmployeeDashboard: React.FC = () => {
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

  return (
    <div>
      <Header />
      
      <div className="container mt-4">
        <RandomQuote />
        <ProfileSection profileFields={profileFields} />
        {userProfile && (
          <BirthdayAnniversarySection
            employees={employees}
            userProfile={{
              id: userProfile.id,
              fullName: userProfile.fullName,
            }}
          />
        )}
      </div>
      
      <div className="container my-5">
        <DashboardTabs 
          tabs={tabsToRender} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="tab-content">
          {tabsToRender?.map((tab) => {
            const config = tabContentMap[tab.target];
            const data = config?.tableConfig?.dataKey === "employees" ? employees : surveys;

            return (
              <div
                key={tab.target}
                className={`tab-pane ${activeTab === tab.target ? "active" : ""}`}
                id={tab.target.replace("#", "")}
              >
                {config && (
                  <TabContentRenderer
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
                      setSelectedImage
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

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

      <ImagePreviewModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)}
      />

      <Footer />
    </div>
  );
};

export default EmployeeDashboard;