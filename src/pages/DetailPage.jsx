import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import CommentInput from '../components/CommentInput'
import CommentItem from '../components/CommentItem'
import VoteButtons from '../components/VoteButtons'
import { postedAt, sanitize } from '../utils'
import {
  asyncAddComment,
  asyncReceiveThreadDetail,
  asyncToggleVoteComment,
  asyncToggleVoteDetail,
  clearThreadDetail
} from '../states/threadDetail'

export default function DetailPage () {
  const { id } = useParams()
  const dispatch = useDispatch()
  const thread = useSelector((state) => state.threadDetail)
  const authUser = useSelector((state) => state.authUser)

  useEffect(() => {
    dispatch(asyncReceiveThreadDetail(id))
    return () => { dispatch(clearThreadDetail()) }
  }, [id, dispatch])

  if (!thread) return null

  return (
    <section>
      <article className='post'>
        <header className='post__head'>
          <Avatar user={thread.owner} size={40} ring />
          <div className='post__who'>
            <strong>{thread.owner.name}</strong>
            <small>{postedAt(thread.createdAt)}</small>
          </div>
          {thread.category && <span className='tag'>#{thread.category}</span>}
        </header>
        <div className='post__body'>
          <h1>{thread.title}</h1>
          <div className='body' dangerouslySetInnerHTML={{ __html: sanitize(thread.body) }} />
        </div>
        <footer className='post__actions'>
          <VoteButtons
            upVotesBy={thread.upVotesBy}
            downVotesBy={thread.downVotesBy}
            userId={authUser?.id}
            onVote={(type) => dispatch(asyncToggleVoteDetail(type))}
          />
        </footer>
      </article>

      <h3 className='section-title'>Komentar ({thread.comments.length})</h3>
      {authUser
        ? <CommentInput onAdd={(content) => dispatch(asyncAddComment({ threadId: thread.id, content }))} />
        : <p className='empty'><Link to='/login'>Masuk</Link> untuk menulis komentar.</p>}
      <div className='comments'>
        {thread.comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            authUserId={authUser?.id}
            onVote={(commentId, type) => dispatch(asyncToggleVoteComment({ commentId, type }))}
          />
        ))}
      </div>
    </section>
  )
}
