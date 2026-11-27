import { useSelector } from 'react-redux'

export default function Loading () {
  const loading = useSelector((state) => state.loading)
  if (loading === 0) return null
  return (
    <div className='loading-bar' role='status' aria-label='Memuat data'>
      <div className='loading-bar__inner' />
    </div>
  )
}
