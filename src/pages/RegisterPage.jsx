import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import RegisterInput from '../components/RegisterInput'
import { asyncRegister } from '../states/authUser'

export default function RegisterPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onRegister = async (data) => {
    if (await dispatch(asyncRegister(data))) {
      window.alert('Pendaftaran berhasil, silakan masuk.')
      navigate('/login')
    }
  }

  return (
    <section className='auth'>
      <h1>Daftar Akun</h1>
      <RegisterInput onRegister={onRegister} />
      <p>Sudah punya akun? <Link to='/login'>Masuk</Link></p>
    </section>
  )
}
