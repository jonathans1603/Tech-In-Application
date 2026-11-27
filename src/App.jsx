import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import AddThreadPage from './pages/AddThreadPage'
import DetailPage from './pages/DetailPage'
import HomePage from './pages/HomePage'
import LeaderboardPage from './pages/LeaderboardPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { asyncLogout } from './states/authUser'
import { asyncPreloadProcess } from './states/isPreload'
import ProfilePage from './pages/ProfilePage'

export default function App () {
  const dispatch = useDispatch()
  const location = useLocation()
  const authUser = useSelector((state) => state.authUser)
  const isPreload = useSelector((state) => state.isPreload)

  useEffect(() => {
    dispatch(asyncPreloadProcess())
  }, [dispatch])

  if (isPreload) return <Loading />

  return (
    <>
      <Loading />
      <Navbar authUser={authUser} onLogout={() => dispatch(asyncLogout())} />
      <main className='container'>
        {/* key = pathname: setiap pindah halaman, animasi transisi diputar ulang */}
        <div className='page' key={location.pathname}>
          <Routes location={location}>
            <Route path='/' element={<HomePage />} />
            <Route path='/threads/:id' element={<DetailPage />} />
            <Route path='/leaderboard' element={<LeaderboardPage />} />
            <Route path='/login' element={authUser ? <Navigate to='/' /> : <LoginPage />} />
            <Route path='/register' element={authUser ? <Navigate to='/' /> : <RegisterPage />} />
            <Route path='/new' element={authUser ? <AddThreadPage /> : <Navigate to='/login' />} />
            <Route path='*' element={<Navigate to='/' />} />
            <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
          </Routes>
        </div>
      </main>
    </>
  )
}
