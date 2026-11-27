import DOMPurify from 'dompurify'

export function postedAt (date) {
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export const sanitize = (html) => DOMPurify.sanitize(html)

export function stripHtml (html) {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent || ''
}

// Menghitung daftar vote baru (up/down) secara immutable untuk optimistic update.
export function applyVote (item, userId, type) {
  const key = type === 'up' ? 'upVotesBy' : 'downVotesBy'
  const otherKey = type === 'up' ? 'downVotesBy' : 'upVotesBy'
  const already = item[key].includes(userId)
  return {
    [key]: already ? item[key].filter((id) => id !== userId) : [...item[key], userId],
    [otherKey]: item[otherKey].filter((id) => id !== userId)
  }
}

export function voteEndpoint (votes, userId) {
  if (votes.upVotesBy.includes(userId)) return 'up-vote'
  if (votes.downVotesBy.includes(userId)) return 'down-vote'
  return 'neutral-vote'
}
