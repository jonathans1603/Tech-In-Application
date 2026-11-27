import { Link, NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import Avatar from './Avatar'
import { HomeIcon, LeaderboardIcon, LogoutIcon, PlusIcon, UserIcon } from './Icons'
import { userShape } from '../utils/propTypes'

export default function Navbar ({ authUser, onLogout }) {
  return (
    <>
      <header className='topbar'>
        <Link to='/' className='brand'>Tech-in</Link>
        <div className='topbar__user'>
          {authUser
            ? (
              <>
              <Link to='/profile' aria-label='Akun saya'>
                <Avatar user={authUser} size={30} ring />
              </Link>
                <button type='button' className='icon-btn' aria-label='Keluar' onClick={onLogout}>
                  <LogoutIcon size={22} />
                </button>
              </>
              )
            : <Link to='/login' className='btn'>Masuk</Link>}
        </div>
      </header>

      <nav className='tabbar' aria-label='Navigasi utama'>
        <NavLink to='/' end aria-label='Beranda'><HomeIcon /></NavLink>
        <NavLink to='/leaderboard' aria-label='Leaderboard'><LeaderboardIcon /></NavLink>
        {authUser
          ? <NavLink to='/new' aria-label='Buat thread'><PlusIcon /></NavLink>
          : <NavLink to='/login' aria-label='Masuk'><UserIcon /></NavLink>}
      </nav>
    </>
  )
}

Navbar.propTypes = {
  authUser: userShape,
  onLogout: PropTypes.func.isRequired
}
