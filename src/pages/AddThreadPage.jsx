import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ThreadInput from '../components/ThreadInput'
import { asyncAddThread } from '../states/threads'

export default function AddThreadPage () {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onAdd = async (data) => {
    if (await dispatch(asyncAddThread(data))) navigate('/')
  }

  return (
    <section className='auth'>
      <h1>Buat Thread Baru</h1>
      <ThreadInput onAdd={onAdd} />
    </section>
  )
}
