import PropTypes from 'prop-types'
import Avatar from './Avatar'
import { userShape } from '../utils/propTypes'

export default function LeaderboardItem ({ rank, user, score }) {
  return (
    <li className='leader'>
      <span className='leader__rank'>{rank}</span>
      <Avatar user={user} size={40} />
      <span className='leader__name'>{user.name}</span>
      <strong>{score}</strong>
    </li>
  )
}

LeaderboardItem.propTypes = {
  rank: PropTypes.number.isRequired,
  user: userShape.isRequired,
  score: PropTypes.number.isRequired
}
