import PropTypes from 'prop-types'
import useInput from '../hooks/useInput'

export default function RegisterInput ({ onRegister }) {
  const [name, onNameChange] = useInput()
  const [email, onEmailChange] = useInput()
  const [password, onPasswordChange] = useInput()

  return (
    <form className='form' onSubmit={(event) => { event.preventDefault(); onRegister({ name, email, password }) }}>
      <input placeholder='Nama' value={name} onChange={onNameChange} required />
      <input type='email' placeholder='Email' value={email} onChange={onEmailChange} required />
      <input type='password' placeholder='Password (min. 6 karakter)' minLength={6} value={password} onChange={onPasswordChange} required />
      <button type='submit' className='btn'>Daftar</button>
    </form>
  )
}

RegisterInput.propTypes = { onRegister: PropTypes.func.isRequired }
