import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CategoryFilter from '../components/CategoryFilter'
import Skeleton from '../components/Skeleton'
import ThreadList from '../components/ThreadList'
import { asyncPopulateUsersAndThreads, asyncToggleVoteThread, setCategory } from '../states/threads'

export default function HomePage () {
  const dispatch = useDispatch()
  const { list, category } = useSelector((state) => state.threads)
  const users = useSelector((state) => state.users)
  const authUser = useSelector((state) => state.authUser)
  const loading = useSelector((state) => state.loading)

  useEffect(() => {
    dispatch(asyncPopulateUsersAndThreads())
  }, [dispatch])

  const categories = [...new Set(list.map((thread) => thread.category).filter(Boolean))]
  const threads = list
    .filter((thread) => category === null || thread.category === category)
    .map((thread) => ({ ...thread, owner: users.find((user) => user.id === thread.ownerId) }))

  return (
    <section>
      <CategoryFilter
        categories={categories}
        selected={category}
        onSelect={(value) => dispatch(setCategory(value))}
      />
      {list.length === 0 && loading > 0
        ? <Skeleton />
        : (
          <ThreadList
            threads={threads}
            authUserId={authUser?.id}
            onVote={(threadId, type) => dispatch(asyncToggleVoteThread({ threadId, type }))}
          />
          )}
    </section>
  )
}
