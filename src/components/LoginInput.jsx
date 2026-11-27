import PropTypes from 'prop-types'
import useInput from '../hooks/useInput'

export default function LoginInput ({ onLogin }) {
  const [email, onEmailChange] = useInput()
  const [password, onPasswordChange] = useInput()

  return (
    <form className='form' onSubmit={(event) => { event.preventDefault(); onLogin({ email, password }) }}>
      <input type='email' placeholder='Email' value={email} onChange={onEmailChange} required />
      <input type='password' placeholder='Password' value={password} onChange={onPasswordChange} required />
      <button type='submit' className='btn'>Masuk</button>
    </form>
  )
}

LoginInput.propTypes = { onLogin: PropTypes.func.isRequired }
