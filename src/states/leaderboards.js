import { createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { showLoading, hideLoading } from './loading'

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState: [],
  reducers: { setLeaderboards: (state, action) => action.payload }
})

export const { setLeaderboards } = leaderboardsSlice.actions

export const asyncReceiveLeaderboards = () => async (dispatch) => {
  dispatch(showLoading())
  try {
    dispatch(setLeaderboards(await api.getLeaderboards()))
  } catch (error) {
    window.alert(error.message)
  } finally {
    dispatch(hideLoading())
  }
}

export default leaderboardsSlice.reducer
