import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    setting: {
        item: {
            view_type: "grid",
            image_size: 4
        }
    }
}

export const settingSlice = createSlice({
    name: 'setting',
    initialState: initialState,

    reducers: {
        setSetting: (state, action) => {
            state.setting = action?.payload
        },
    },
})

export const { setSetting } = settingSlice.actions
export default settingSlice.reducer