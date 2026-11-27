import PropTypes from 'prop-types'
import useInput from '../hooks/useInput'

export default function ThreadInput ({ onAdd }) {
  const [title, onTitleChange] = useInput()
  const [category, onCategoryChange] = useInput()
  const [body, onBodyChange] = useInput()

  const handleSubmit = (event) => {
    event.preventDefault()
    onAdd({ title, category, body })
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <input placeholder='Judul' value={title} onChange={onTitleChange} required />
      <input placeholder='Kategori (mis. react, ai, devops)' value={category} onChange={onCategoryChange} />
      <textarea placeholder='Tulis isi thread…' rows={8} value={body} onChange={onBodyChange} required />
      <button type='submit' className='btn'>Publikasikan</button>
    </form>
  )
}

ThreadInput.propTypes = { onAdd: PropTypes.func.isRequired }
