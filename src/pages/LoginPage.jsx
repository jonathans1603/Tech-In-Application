import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import LoginInput from '../components/LoginInput'
import { asyncLogin } from '../states/authUser'

export default function LoginPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogin = async (credentials) => {
    if (await dispatch(asyncLogin(credentials))) navigate('/')
  }

  return (
    <section className='auth'>
      <h1>Masuk ke Tech-in</h1>
      <LoginInput onLogin={onLogin} />
      <p>Belum punya akun? <Link to='/register'>Daftar</Link></p>
    </section>
  )
}
