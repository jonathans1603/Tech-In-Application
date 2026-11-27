import PropTypes from 'prop-types'
import ThreadItem from './ThreadItem'
import { threadShape } from '../utils/propTypes'

export default function ThreadList ({ threads, authUserId, onVote }) {
  if (threads.length === 0) return <p className='empty'>Belum ada thread.</p>
  return (
    <div className='list'>
      {threads.map((thread, index) => (
        <ThreadItem
          key={thread.id}
          thread={thread}
          authUserId={authUserId}
          onVote={onVote}
          index={Math.min(index, 8)}
        />
      ))}
    </div>
  )
}

ThreadList.propTypes = {
  threads: PropTypes.arrayOf(threadShape).isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired
}
