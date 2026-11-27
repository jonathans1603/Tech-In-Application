import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ThreadSkeleton () {
  return (
    <div className='list' aria-hidden='true'>
      {[0, 1, 2].map((item) => (
        <div key={item} className='post'>
          <div className='post__head'>
            <Skeleton circle width={36} height={36} />
            <div style={{ flex: 1 }}><Skeleton width='40%' /></div>
          </div>
          <div className='post__body'>
            <Skeleton height={18} width='70%' />
            <Skeleton count={2} />
          </div>
        </div>
      ))}
    </div>
  )
}
