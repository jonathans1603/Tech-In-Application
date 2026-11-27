/**
 * Skenario pengujian thunk threads (optimistic vote dan populate)
 *
 * - asyncToggleVoteThread
 *   - saat pengguna belum login
 *     - harus menampilkan alert dan tidak memanggil API
 *   - saat up-vote berhasil
 *     - harus meng-update state lebih dulu (optimistic), lalu memanggil API up-vote
 *   - saat pengguna sudah up-vote dan menekan up-vote lagi
 *     - harus mencabut vote dan memanggil API neutral-vote
 *   - saat API gagal
 *     - harus menampilkan alert dan mengembalikan vote ke kondisi semula (rollback)
 * - asyncPopulateUsersAndThreads
 *   - saat berhasil harus men-dispatch setUsers dan setThreads
 *   - saat gagal harus menampilkan alert dan tetap memanggil hideLoading
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import api from '../api'
import { asyncToggleVoteThread, asyncPopulateUsersAndThreads, setThreadVotes, setThreads } from './threads'
import { setUsers } from './users'
import { showLoading, hideLoading } from './loading'

vi.mock('../api', () => ({
  default: { voteThread: vi.fn(), getAllUsers: vi.fn(), getAllThreads: vi.fn() }
}))

const thread = { id: 't1', title: 'Judul', upVotesBy: [], downVotesBy: [] }
const stateFor = (authUser, current = thread) => () => ({ authUser, threads: { list: [current] } })

describe('thunk asyncToggleVoteThread', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('menolak vote dan tidak memanggil API saat belum login', async () => {
    const dispatch = vi.fn()
    await asyncToggleVoteThread({ threadId: 't1', type: 'up' })(dispatch, stateFor(null))
    expect(window.alert).toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalled()
    expect(api.voteThread).not.toHaveBeenCalled()
  })

  it('meng-update state lebih dulu lalu memanggil API up-vote', async () => {
    api.voteThread.mockResolvedValue({})
    const dispatch = vi.fn()
    await asyncToggleVoteThread({ threadId: 't1', type: 'up' })(dispatch, stateFor({ id: 'u1' }))

    expect(dispatch).toHaveBeenCalledWith(setThreadVotes({ threadId: 't1', upVotesBy: ['u1'], downVotesBy: [] }))
    expect(api.voteThread).toHaveBeenCalledWith('t1', 'up-vote')
  })

  it('mencabut vote dan memanggil neutral-vote saat up-vote ditekan dua kali', async () => {
    api.voteThread.mockResolvedValue({})
    const dispatch = vi.fn()
    const liked = { ...thread, upVotesBy: ['u1'] }
    await asyncToggleVoteThread({ threadId: 't1', type: 'up' })(dispatch, stateFor({ id: 'u1' }, liked))

    expect(dispatch).toHaveBeenCalledWith(setThreadVotes({ threadId: 't1', upVotesBy: [], downVotesBy: [] }))
    expect(api.voteThread).toHaveBeenCalledWith('t1', 'neutral-vote')
  })

  it('mengembalikan vote ke kondisi semula saat API gagal', async () => {
    api.voteThread.mockRejectedValue(new Error('Server error'))
    const dispatch = vi.fn()
    await asyncToggleVoteThread({ threadId: 't1', type: 'down' })(dispatch, stateFor({ id: 'u1' }))

    expect(dispatch).toHaveBeenNthCalledWith(1, setThreadVotes({ threadId: 't1', upVotesBy: [], downVotesBy: ['u1'] }))
    expect(window.alert).toHaveBeenCalledWith('Server error')
    expect(dispatch).toHaveBeenNthCalledWith(2, setThreadVotes({ threadId: 't1', upVotesBy: [], downVotesBy: [] }))
  })
})

describe('thunk asyncPopulateUsersAndThreads', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('men-dispatch setUsers dan setThreads saat berhasil', async () => {
    api.getAllUsers.mockResolvedValue([{ id: 'u1' }])
    api.getAllThreads.mockResolvedValue([thread])
    const dispatch = vi.fn()
    await asyncPopulateUsersAndThreads()(dispatch)

    expect(dispatch).toHaveBeenCalledWith(showLoading())
    expect(dispatch).toHaveBeenCalledWith(setUsers([{ id: 'u1' }]))
    expect(dispatch).toHaveBeenCalledWith(setThreads([thread]))
    expect(dispatch).toHaveBeenLastCalledWith(hideLoading())
  })

  it('menampilkan alert dan tetap menyembunyikan loading saat gagal', async () => {
    api.getAllUsers.mockRejectedValue(new Error('Jaringan bermasalah'))
    api.getAllThreads.mockResolvedValue([])
    const dispatch = vi.fn()
    await asyncPopulateUsersAndThreads()(dispatch)

    expect(window.alert).toHaveBeenCalledWith('Jaringan bermasalah')
    expect(dispatch).toHaveBeenLastCalledWith(hideLoading())
  })
})
