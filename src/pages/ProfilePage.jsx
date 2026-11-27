import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from '../components/Avatar'
import ThreadList from '../components/ThreadList'
import { asyncPopulateUsersAndThreads, asyncToggleVoteThread } from '../states/threads'

export default function ProfilePage () {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.authUser)
  const list = useSelector((state) => state.threads.list)

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads())
  }, [dispatch])

  const myThreads = list
    .filter((thread) => thread.ownerId === authUser.id)
    .map((thread) => ({ ...thread, owner: authUser }))
  const totalLikes = myThreads.reduce((sum, thread) => sum + thread.upVotesBy.length, 0)
  const totalComments = myThreads.reduce((sum, thread) => sum + thread.totalComments, 0)

  return (
    <section>
      <div className='profile'>
        <Avatar user={authUser} size={88} ring />
        <div>
          <h1>{authUser.name}</h1>
          <p>{authUser.email}</p>
        </div>
      </div>

      <div className='stats'>
        <div className='stat'><strong>{myThreads.length}</strong><span>Thread</span></div>
        <div className='stat'><strong>{totalLikes}</strong><span>Suka diterima</span></div>
        <div className='stat'><strong>{totalComments}</strong><span>Komentar</span></div>
      </div>

      <h3 className='section-title'>Thread saya</h3>
      <ThreadList
        threads={myThreads}
        authUserId={authUser.id}
        onVote={(threadId, type) => dispatch(asyncToggleVoteThread({ threadId, type }))}
      />
    </section>
  )
}
