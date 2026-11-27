import { configureStore } from '@reduxjs/toolkit'
import authUser from './authUser'
import isPreload from './isPreload'
import loading from './loading'
import users from './users'
import threads from './threads'
import threadDetail from './threadDetail'
import leaderboards from './leaderboards'

const store = configureStore({
  reducer: { authUser, isPreload, loading, users, threads, threadDetail, leaderboards }
})

export default store
