const BASE_URL = 'https://forum-api.dicoding.dev/v1'
const TOKEN_KEY = 'tech-in-token'

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY)
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY)

async function request (path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) headers.Authorization = `Bearer ${getAccessToken()}`

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const json = await response.json()
  if (json.status !== 'success') throw new Error(json.message)
  return json.data
}

const api = {
  register: async (data) => (await request('/register', { method: 'POST', body: data })).user,
  login: async (data) => (await request('/login', { method: 'POST', body: data })).token,
  getOwnProfile: async () => (await request('/users/me', { auth: true })).user,
  getAllUsers: async () => (await request('/users')).users,
  getAllThreads: async () => (await request('/threads')).threads,
  getThreadDetail: async (id) => (await request(`/threads/${id}`)).detailThread,
  createThread: async (data) => (await request('/threads', { method: 'POST', body: data, auth: true })).thread,
  createComment: async (threadId, content) =>
    (await request(`/threads/${threadId}/comments`, { method: 'POST', body: { content }, auth: true })).comment,
  voteThread: (threadId, endpoint) =>
    request(`/threads/${threadId}/${endpoint}`, { method: 'POST', auth: true }),
  voteComment: (threadId, commentId, endpoint) =>
    request(`/threads/${threadId}/comments/${commentId}/${endpoint}`, { method: 'POST', auth: true }),
  getLeaderboards: async () => (await request('/leaderboards')).leaderboards
}

export default api
