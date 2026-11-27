import { createSlice } from '@reduxjs/toolkit'
import api from '../api'
import { applyVote, voteEndpoint } from '../utils'
import { showLoading, hideLoading } from './loading'

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: null,
  reducers: {
    setThreadDetail: (state, action) => action.payload,
    clearThreadDetail: () => null,
    addComment: (state, action) => {
      state.comments.unshift(action.payload)
    },
    setDetailVotes: (state, action) => {
      const { upVotesBy, downVotesBy } = action.payload
      Object.assign(state, { upVotesBy, downVotesBy })
    },
    setCommentVotes: (state, action) => {
      const { commentId, upVotesBy, downVotesBy } = action.payload
      const comment = state.comments.find((item) => item.id === commentId)
      if (comment) Object.assign(comment, { upVotesBy, downVotesBy })
    }
  }
})

export const { setThreadDetail, clearThreadDetail, addComment, setDetailVotes, setCommentVotes } =
  threadDetailSlice.actions

export const asyncReceiveThreadDetail = (threadId) => async (dispatch) => {
  dispatch(showLoading())
  try {
    dispatch(setThreadDetail(await api.getThreadDetail(threadId)))
  } catch (error) {
    window.alert(error.message)
  } finally {
    dispatch(hideLoading())
  }
}

export const asyncAddComment = ({ threadId, content }) => async (dispatch, getState) => {
  dispatch(showLoading())
  try {
    const comment = await api.createComment(threadId, content)
    const { authUser } = getState()
    dispatch(addComment({ ...comment, owner: authUser }))
  } catch (error) {
    window.alert(error.message)
  } finally {
    dispatch(hideLoading())
  }
}

export const asyncToggleVoteDetail = (type) => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState()
  if (!authUser) return window.alert('Silakan login terlebih dahulu untuk memberi vote.')

  const previous = { upVotesBy: threadDetail.upVotesBy, downVotesBy: threadDetail.downVotesBy }
  const next = applyVote(threadDetail, authUser.id, type)
  dispatch(setDetailVotes(next))
  try {
    await api.voteThread(threadDetail.id, voteEndpoint(next, authUser.id))
  } catch (error) {
    window.alert(error.message)
    dispatch(setDetailVotes(previous))
  }
}

export const asyncToggleVoteComment = ({ commentId, type }) => async (dispatch, getState) => {
  const { authUser, threadDetail } = getState()
  if (!authUser) return window.alert('Silakan login terlebih dahulu untuk memberi vote.')
  const comment = threadDetail.comments.find((item) => item.id === commentId)

  const previous = { upVotesBy: comment.upVotesBy, downVotesBy: comment.downVotesBy }
  const next = applyVote(comment, authUser.id, type)
  dispatch(setCommentVotes({ commentId, ...next }))
  try {
    await api.voteComment(threadDetail.id, commentId, voteEndpoint(next, authUser.id))
  } catch (error) {
    window.alert(error.message)
    dispatch(setCommentVotes({ commentId, ...previous }))
  }
}

export default threadDetailSlice.reducer
