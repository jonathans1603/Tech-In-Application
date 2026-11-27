import PropTypes from 'prop-types'
import Avatar from './Avatar'
import VoteButtons from './VoteButtons'
import { postedAt, sanitize } from '../utils'
import { commentShape } from '../utils/propTypes'

export default function CommentItem ({ comment, authUserId, onVote }) {
  return (
    <article className='comment'>
      <Avatar user={comment.owner} size={34} />
      <div className='comment__main'>
        <div>
          <strong>{comment.owner?.name}</strong>{' '}
          <span className='comment__text' dangerouslySetInnerHTML={{ __html: sanitize(comment.content) }} />
        </div>
        <small>{postedAt(comment.createdAt)}</small>
        <VoteButtons
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
          userId={authUserId}
          onVote={(type) => onVote(comment.id, type)}
        />
      </div>
    </article>
  )
}

CommentItem.propTypes = {
  comment: commentShape.isRequired,
  authUserId: PropTypes.string,
  onVote: PropTypes.func.isRequired
}
