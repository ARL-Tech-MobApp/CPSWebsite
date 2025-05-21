import React from "react";
import { TabConfig } from "../types/common";

interface DashboardTabsProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange?: (target: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ 
  tabs, 
  activeTab,
  onTabChange 
}) => {
  const handleTabClick = (target: string) => {
    if (onTabChange) {
      onTabChange(target);
    }
  };

  return (
    <nav className="my-3">
      <div className="nav nav-tabs flex-nowrap overflow-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`nav-link ${activeTab === tab.target ? "active" : ""}`}
            onClick={() => handleTabClick(tab.target)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default DashboardTabs;