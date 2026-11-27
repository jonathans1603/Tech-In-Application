import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LeaderboardItem from '../components/LeaderboardItem'
import { asyncReceiveLeaderboards } from '../states/leaderboards'

export default function LeaderboardPage () {
  const dispatch = useDispatch()
  const leaderboards = useSelector((state) => state.leaderboards)

  useEffect(() => {
    dispatch(asyncReceiveLeaderboards())
  }, [dispatch])

  return (
    <section>
      <h1>Leaderboard</h1>
      <ol className='leaders'>
        {leaderboards.map(({ user, score }, index) => (
          <LeaderboardItem key={user.id} rank={index + 1} user={user} score={score} />
        ))}
      </ol>
    </section>
  )
}
