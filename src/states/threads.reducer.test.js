/**
 * Skenario pengujian threads reducer
 *
 * - saat diberi action setThreads
 *   - harus mengganti seluruh daftar thread dengan payload
 * - saat diberi action addThread
 *   - harus menaruh thread baru di urutan paling atas
 * - saat diberi action setCategory
 *   - harus menyimpan kategori terpilih, dan null untuk menghapus filter
 * - saat diberi action setThreadVotes
 *   - harus memperbarui vote hanya pada thread dengan id yang sesuai
 *   - tidak boleh mengubah state bila id thread tidak ditemukan
 */
import { describe, it, expect } from 'vitest'
import reducer, { setThreads, addThread, setCategory, setThreadVotes } from './threads'

const makeThread = (id, extra = {}) => ({
  id, title: `Thread ${id}`, body: 'isi', upVotesBy: [], downVotesBy: [], totalComments: 0, ...extra
})

describe('threads reducer', () => {
  it('mengembalikan initial state saat action tidak dikenal', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual({ list: [], category: null })
  })

  it('mengganti daftar thread saat setThreads', () => {
    const state = reducer({ list: [makeThread('lama')], category: null }, setThreads([makeThread('a'), makeThread('b')]))
    expect(state.list.map((thread) => thread.id)).toEqual(['a', 'b'])
  })

  it('menaruh thread baru di paling atas saat addThread', () => {
    const state = reducer({ list: [makeThread('a')], category: null }, addThread(makeThread('baru')))
    expect(state.list.map((thread) => thread.id)).toEqual(['baru', 'a'])
  })

  it('menyimpan dan menghapus kategori saat setCategory', () => {
    const selected = reducer({ list: [], category: null }, setCategory('react'))
    expect(selected.category).toBe('react')
    expect(reducer(selected, setCategory(null)).category).toBeNull()
  })

  it('memperbarui vote hanya pada thread yang sesuai saat setThreadVotes', () => {
    const initial = { list: [makeThread('a'), makeThread('b')], category: null }
    const state = reducer(initial, setThreadVotes({ threadId: 'b', upVotesBy: ['u1'], downVotesBy: ['u2'] }))
    expect(state.list[0].upVotesBy).toEqual([])
    expect(state.list[1]).toMatchObject({ upVotesBy: ['u1'], downVotesBy: ['u2'] })
  })

  it('tidak mengubah state saat id thread pada setThreadVotes tidak ditemukan', () => {
    const initial = { list: [makeThread('a')], category: null }
    const state = reducer(initial, setThreadVotes({ threadId: 'x', upVotesBy: ['u1'], downVotesBy: [] }))
    expect(state).toEqual(initial)
  })
})
