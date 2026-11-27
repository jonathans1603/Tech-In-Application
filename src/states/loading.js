import { createSlice } from '@reduxjs/toolkit'

const loadingSlice = createSlice({
  name: 'loading',
  initialState: 0,
  reducers: {
    showLoading: (state) => state + 1,
    hideLoading: (state) => Math.max(0, state - 1)
  }
})

export const { showLoading, hideLoading } = loadingSlice.actions
export default loadingSlice.reducer
