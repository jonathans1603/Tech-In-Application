import { createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { setAuthUser } from './authUser'

const isPreloadSlice = createSlice({
  name: 'isPreload',
  initialState: true,
  reducers: { setIsPreload: (state, action) => action.payload }
})

export const { setIsPreload } = isPreloadSlice.actions

export const asyncPreloadProcess = () => async (dispatch) => {
  try {
    const user = await api.getOwnProfile()
    dispatch(setAuthUser(user))
  } catch {
    dispatch(setAuthUser(null))
  } finally {
    dispatch(setIsPreload(false))
  }
}

export default isPreloadSlice.reducer
