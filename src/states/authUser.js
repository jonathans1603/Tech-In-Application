import { createSlice } from '@reduxjs/toolkit'
import api, { putAccessToken, removeAccessToken } from '../api'
import { showLoading, hideLoading } from './loading'

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: null,
  reducers: { setAuthUser: (state, action) => action.payload }
})

export const { setAuthUser } = authUserSlice.actions

export const asyncLogin = ({ email, password }) => async (dispatch) => {
  dispatch(showLoading())
  try {
    const token = await api.login({ email, password })
    putAccessToken(token)
    dispatch(setAuthUser(await api.getOwnProfile()))
    return true
  } catch (error) {
    window.alert(error.message)
    return false
  } finally {
    dispatch(hideLoading())
  }
}

export const asyncRegister = ({ name, email, password }) => async (dispatch) => {
  dispatch(showLoading())
  try {
    await api.register({ name, email, password })
    return true
  } catch (error) {
    window.alert(error.message)
    return false
  } finally {
    dispatch(hideLoading())
  }
}

export const asyncLogout = () => (dispatch) => {
  removeAccessToken()
  dispatch(setAuthUser(null))
}

export default authUserSlice.reducer
