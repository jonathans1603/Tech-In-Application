import { createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { applyVote, voteEndpoint } from '../utils'
import { showLoading, hideLoading } from './loading'
import { setUsers } from './users'

const threadsSlice = createSlice({
  name: 'threads',
  initialState: { list: [], category: null },
  reducers: {
    setThreads: (state, action) => { state.list = action.payload },
    addThread: (state, action) => { state.list.unshift(action.payload) },
    setCategory: (state, action) => { state.category = action.payload },
    setThreadVotes: (state, action) => {
      const { threadId, upVotesBy, downVotesBy } = action.payload
      const thread = state.list.find((item) => item.id === threadId)
      if (thread) Object.assign(thread, { upVotesBy, downVotesBy })
    }
  }
})

export const { setThreads, addThread, setCategory, setThreadVotes } = threadsSlice.actions

export const asyncPopulateUsersAndThreads = () => async (dispatch) => {
  dispatch(showLoading())
  try {
    const [users, threads] = await Promise.all([api.getAllUsers(), api.getAllThreads()])
    dispatch(setUsers(users))
    dispatch(setThreads(threads))
  } catch (error) {
    window.alert(error.message)
  } finally {
    dispatch(hideLoading())
  }
}

export const asyncAddThread = (data) => async (dispatch) => {
  dispatch(showLoading())
  try {
    dispatch(addThread(await api.createThread(data)))
    return true
  } catch (error) {
    window.alert(error.message)
    return false
  } finally {
    dispatch(hideLoading())
  }
}

// Optimistic update: UI langsung berubah, dikembalikan bila request gagal.
export const asyncToggleVoteThread = ({ threadId, type }) => async (dispatch, getState) => {
  const { authUser, threads } = getState()
  if (!authUser) return window.alert('Silakan login terlebih dahulu untuk memberi vote.')
  const thread = threads.list.find((item) => item.id === threadId)
  if (!thread) return

  const previous = { upVotesBy: thread.upVotesBy, downVotesBy: thread.downVotesBy }
  const next = applyVote(thread, authUser.id, type)
  dispatch(setThreadVotes({ threadId, ...next }))
  try {
    await api.voteThread(threadId, voteEndpoint(next, authUser.id))
  } catch (error) {
    window.alert(error.message)
    dispatch(setThreadVotes({ threadId, ...previous }))
  }
}

export default threadsSlice.reducer
