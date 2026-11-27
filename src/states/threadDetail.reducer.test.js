/**
 * Skenario pengujian threadDetail reducer
 *
 * - saat diberi action setThreadDetail
 *   - harus menyimpan detail thread
 * - saat diberi action clearThreadDetail
 *   - harus mengembalikan state menjadi null
 * - saat diberi action addComment
 *   - harus menaruh komentar baru di urutan paling atas
 * - saat diberi action setDetailVotes
 *   - harus memperbarui vote thread tanpa mengubah komentar
 * - saat diberi action setCommentVotes
 *   - harus memperbarui vote pada komentar yang sesuai saja
 */
import { describe, it, expect } from 'vitest'
import reducer, {
  setThreadDetail, clearThreadDetail, addComment, setDetailVotes, setCommentVotes
} from './threadDetail'

const comment = (id) => ({ id, content: `komentar ${id}`, upVotesBy: [], downVotesBy: [] })
const detail = () => ({ id: 't1', title: 'Judul', upVotesBy: [], downVotesBy: [], comments: [comment('c1'), comment('c2')] })

describe('threadDetail reducer', () => {
  it('menyimpan detail thread saat setThreadDetail', () => {
    expect(reducer(null, setThreadDetail(detail())).id).toBe('t1')
  })

  it('mengembalikan null saat clearThreadDetail', () => {
    expect(reducer(detail(), clearThreadDetail())).toBeNull()
  })

  it('menaruh komentar baru di paling atas saat addComment', () => {
    const state = reducer(detail(), addComment(comment('baru')))
    expect(state.comments.map((item) => item.id)).toEqual(['baru', 'c1', 'c2'])
  })

  it('memperbarui vote thread saat setDetailVotes', () => {
    const state = reducer(detail(), setDetailVotes({ upVotesBy: ['u1'], downVotesBy: [] }))
    expect(state.upVotesBy).toEqual(['u1'])
    expect(state.comments[0].upVotesBy).toEqual([])
  })

  it('memperbarui vote pada komentar yang sesuai saat setCommentVotes', () => {
    const state = reducer(detail(), setCommentVotes({ commentId: 'c2', upVotesBy: [], downVotesBy: ['u9'] }))
    expect(state.comments[0].downVotesBy).toEqual([])
    expect(state.comments[1].downVotesBy).toEqual(['u9'])
  })
})
