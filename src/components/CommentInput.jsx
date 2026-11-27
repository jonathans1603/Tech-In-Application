import PropTypes from 'prop-types'
import useInput from '../hooks/useInput'

export default function CommentInput ({ onAdd }) {
  const [content, onChange, setContent] = useInput()

  const handleSubmit = (event) => {
    event.preventDefault()
    onAdd(content)
    setContent('')
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <textarea placeholder='Tulis komentar…' rows={3} value={content} onChange={onChange} required />
      <button type='submit' className='btn'>Kirim Komentar</button>
    </form>
  )
}

CommentInput.propTypes = { onAdd: PropTypes.func.isRequired }
