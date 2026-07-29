import { createSlice } from "@reduxjs/toolkit";

export const SETTINGS_TABS = {
  BUSINESS_SETTING: "businessSetting",
  MANAGE_MODULE: "manageModule",
  SIDEBAR_BUILDER: "sidebarBuilder",
  ACCOUNT_SETTING: "accountSetting",
};

const settingsTabSlice = createSlice({
  name: "settingsTab",
  initialState: {
    activeTab: SETTINGS_TABS.BUSINESS_SETTING,
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = settingsTabSlice.actions;
export default settingsTabSlice.reducer;