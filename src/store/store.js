import { configureStore } from '@reduxjs/toolkit'

import moduleReducer from "@/store/features/moudleSlice"
import settingReducer from "@/store/features/settingSlice"

export default configureStore({
    reducer: {
        module: moduleReducer,
        setting: settingReducer
    },
})