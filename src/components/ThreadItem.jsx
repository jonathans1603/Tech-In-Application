import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Avatar from './Avatar'
import { CommentIcon, HeartIcon } from './Icons'
import VoteButtons from './VoteButtons'
import { postedAt, stripHtml } from '../utils'
import { threadShape } from '../utils/propTypes'

export default function ThreadItem ({ thread, authUserId, onVote, index = 0 }) {
  const [burst, setBurst] = useState(false)
  const snippet = stripHtml(thread.body)
  const liked = !!authUserId && thread.upVotesBy.includes(authUserId)

  // Double-click pada postingan = like, seperti di Instagram.
  const handleDoubleClick = () => {
    if (!authUserId) return
    if (!liked) onVote(thread.id, 'up')
    setBurst(true)
    setTimeout(() => setBurst(false), 800)
  }

  return (
    <article className='post' style={{ '--i': index }}>
      <header className='post__head'>
        <Avatar user={thread.owner} size={36} ring />
        <div className='post__who'>
          <strong>{thread.owner?.name}</strong>
          <small>{postedAt(thread.createdAt)}</small>
        </div>
        {thread.category && <span className='tag'>#{thread.category}</span>}
      </header>

      <div className='post__body' onDoubleClick={handleDoubleClick}>
        <h2><Link to={`/threads/${thread.id}`}>{thread.title}</Link></h2>
        <p>{snippet.length > 160 ? `${snippet.slice(0, 160)}…` : snippet}</p>
        {burst && <HeartIcon filled size={96} className='burst' />}
      </div>

      <footer className='post__actions'>
        <VoteButtons
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userId={authUserId}
          onVote={(type) => onVote(thread.id, type)}
        />
        <Link to={`/threads/${thread.id}`} className='vote' aria-label='Lihat komentar'>
          <CommentIcon size={23} /> <span>{thread.totalComments}</span>
        </Link>
      </footer>
    </article>
  )
}

ThreadItem.propTypes = {
  thread: threadShape.isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired,
  index: PropTypes.number
}
