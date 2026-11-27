import PropTypes from 'prop-types'
import { ArrowDownIcon, HeartIcon } from './Icons'

export default function VoteButtons ({ upVotesBy, downVotesBy, userId, onVote }) {
  const upVoted = !!userId && upVotesBy.includes(userId)
  const downVoted = !!userId && downVotesBy.includes(userId)

  return (
    <div className='votes'>
      <button
        type='button'
        className={`vote ${upVoted ? 'vote--up-active' : ''}`}
        aria-pressed={upVoted}
        aria-label='Up-vote'
        onClick={() => onVote('up')}
      >
        <HeartIcon filled={upVoted} size={24} /> <span>{upVotesBy.length}</span>
      </button>
      <button
        type='button'
        className={`vote ${downVoted ? 'vote--down-active' : ''}`}
        aria-pressed={downVoted}
        aria-label='Down-vote'
        onClick={() => onVote('down')}
      >
        <ArrowDownIcon filled={downVoted} size={22} /> <span>{downVotesBy.length}</span>
      </button>
    </div>
  )
}

VoteButtons.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  userId: PropTypes.string,
  onVote: PropTypes.func.isRequired
}
