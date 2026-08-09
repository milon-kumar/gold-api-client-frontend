import React, { useEffect } from "react";
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
  // { key: SETTINGS_TABS.SIDEBAR_BUILDER, label: "Sidebar Builder" },
  { key: SETTINGS_TABS.ACCOUNT_SETTING, label: "Account Setting" },
];

// Keeps the URL's `?tab=` query param in sync with the active tab.
const setTabInUrl = (tabKey) => {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tabKey);
  window.history.replaceState({}, "", url);
};

const SettingsView = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.settingsTab.activeTab);

  // On mount (and whenever the URL changes, e.g. via browser back/forward),
  // read `?tab=` from the URL and activate the matching tab if it's valid.
  useEffect(() => {
    const applyTabFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && Object.values(SETTINGS_TABS).includes(tabParam)) {
        dispatch(setActiveTab(tabParam));
      }
    };

    applyTabFromUrl();

    window.addEventListener("popstate", applyTabFromUrl);
    return () => window.removeEventListener("popstate", applyTabFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (tabKey) => {
    dispatch(setActiveTab(tabKey));
    setTabInUrl(tabKey);
  };

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
                onClick={() => handleTabClick(tab.key)}
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