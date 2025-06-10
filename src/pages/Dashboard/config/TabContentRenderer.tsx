import React from "react";
import { TabContentConfig } from "../config/tabContentConfig";

interface TabContentRendererProps {
  tabTarget: string;
  config: TabContentConfig;
  data: any;
  handlers: {
    formData: any;
    visitorFormData: any;
    setFormData: React.Dispatch<any>;
    setVisitorFormData: React.Dispatch<any>;
    showEmployeeModal: boolean;
    showVisitorModal: boolean;
    setShowEmployeeModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowVisitorModal: React.Dispatch<React.SetStateAction<boolean>>;
    isEditMode?: boolean;
    setIsEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
    handleView: any;
    handleEdit: any;
    handleEditVisitor: any;
    deleteEmployee: any;
    deleteSurvey: any;
    userProfile: any;
    touchedSurveyIds: string[];
    setShowEmployeeDetailsModal: any;
    setSelectedImage: any;
  };
}
const TabContentRenderer: React.FC<TabContentRendererProps> = ({
  tabTarget,
  config,
  data,
  handlers
}) => (
  <>
    {config.formComponent && (
      <config.formComponent
        formData={tabTarget === "#nav-home" ? handlers.formData : handlers.visitorFormData}
        setFormData={tabTarget === "#nav-home" ? handlers.setFormData : handlers.setVisitorFormData}
        showModal={tabTarget === "#nav-home" ? handlers.showEmployeeModal : handlers.showVisitorModal}
        setShowModal={tabTarget === "#nav-home" ? handlers.setShowEmployeeModal : handlers.setShowVisitorModal}
        isEditMode={tabTarget === "#nav-home" ? handlers.isEditMode : undefined}
        setIsEditMode={tabTarget === "#nav-home" ? handlers.setIsEditMode : undefined}
      />
    )}
    {config.tableConfig && (
      <config.component
        columns={config.tableConfig.columns(
          ...(tabTarget === "#nav-reports"
            ? [
                handlers.userProfile,
                handlers.touchedSurveyIds,
                handlers.setShowEmployeeDetailsModal,
                handlers.setSelectedImage,
              ]
            : [
                handlers.handleView,
                tabTarget === "#nav-home" ? handlers.handleEdit : handlers.handleEditVisitor,
                tabTarget === "#nav-home" ? handlers.deleteEmployee : handlers.deleteSurvey,
              ])
        )}
        data={data}
        rowsPerPage={10}
        heading={config.tableConfig.heading}
        searchKeys={tabTarget === "#nav-home"?["fullName", "phoneNumber"]:["vendorName", "employeeId", "whatsappNumber","pincode"]}
        onView={handlers.handleView}
        onEdit={tabTarget === "#nav-home" ? handlers.handleEdit : handlers.handleEditVisitor}
        onDelete={tabTarget === "#nav-home" ? handlers.deleteEmployee : handlers.deleteSurvey}
        onAdd={() => {
          if (tabTarget === "#nav-home") {
            handlers.setIsEditMode?.(false); // Make sure it's in "add" mode
            handlers.setShowEmployeeModal(true);
          } else {
            handlers.setShowVisitorModal(true);
          }
        }}
        
      />
    )}
    {!config.tableConfig && <config.component />}
  </>
);

export default TabContentRenderer;