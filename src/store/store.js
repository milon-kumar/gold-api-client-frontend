import { configureStore } from '@reduxjs/toolkit'

import moduleReducer from "@/store/features/moudleSlice"
import settingReducer from "@/store/features/settingSlice"
import settingTabReducer from "@/store/features/businessSettingSlice"
export default configureStore({
    reducer: {
        module: moduleReducer,
        setting: settingReducer,
        settingsTab: settingTabReducer
    },
})