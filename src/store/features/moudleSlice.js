import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    module: {

    }
}

export const moduleSlice = createSlice({
    name: 'module',
    initialState: initialState,

    reducers: {
        setModule: (state, action) => {
            state.module = action?.payload
        },
    },
})

export const { setModule } = moduleSlice.actions
export default moduleSlice.reducer