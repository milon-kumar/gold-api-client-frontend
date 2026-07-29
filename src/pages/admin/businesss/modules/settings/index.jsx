import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { SETTINGS_TABS, setActiveTab } from "@/store/features/businessSettingSlice";
import BusinessSettingTab from "./partials/BusinessSettingTab";
import ModuleManageTab from "./partials/ModuleManageTab";
import SidebarBuilderTab from "./partials/SidebarBuilderTab";
import AccountSettingTab from "./partials/AccountSettingTab";

const tabButtons = [
  { key: SETTINGS_TABS.BUSINESS_SETTING, label: "Business Overview" },
  { key: SETTINGS_TABS.MANAGE_MODULE, label: "Module Manager" },
  { key: SETTINGS_TABS.SIDEBAR_BUILDER, label: "Sidebar Builder" },
  { key: SETTINGS_TABS.ACCOUNT_SETTING, label: "Account Setting" },
];

const SettingsView = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.settingsTab.activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-14 bg-background/95 backdrop-blur p-1 sm:p-4 sm:mb-6 z-40 border rounded-md border-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2>Business Settings</h2>
            <p className="text-sm">Manage your business information and settings</p>
          </div>
          <div className="flex items-center gap-3">
            {tabButtons.map((tab) => (
              <Button
                key={tab.key}
                size="sm"
                variant={activeTab === tab.key ? "default" : "outline"}
                onClick={() => dispatch(setActiveTab(tab.key))}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className={activeTab === SETTINGS_TABS.BUSINESS_SETTING ? "block" : "hidden"}>
        <BusinessSettingTab />
      </div>
      <div className={activeTab === SETTINGS_TABS.MANAGE_MODULE ? "block" : "hidden"}>
        <ModuleManageTab />
      </div>
      <div className={activeTab === SETTINGS_TABS.SIDEBAR_BUILDER ? "block" : "hidden"}>
        <SidebarBuilderTab />
      </div>
      <div className={activeTab === SETTINGS_TABS.ACCOUNT_SETTING ? "block" : "hidden"}>
        <AccountSettingTab />
      </div>
    </div>
  );
};

export default SettingsView;