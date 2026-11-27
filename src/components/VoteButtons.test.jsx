/**
 * Skenario pengujian komponen VoteButtons
 *
 * - saat dirender
 *   - harus menampilkan jumlah up-vote dan down-vote
 * - saat pengguna sudah up-vote
 *   - tombol up-vote harus bertanda aktif (aria-pressed true)
 * - saat pengguna belum login
 *   - kedua tombol tidak boleh bertanda aktif
 * - saat tombol ditekan
 *   - harus memanggil onVote dengan 'up' atau 'down'
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VoteButtons from './VoteButtons'

describe('VoteButtons', () => {
  it('menampilkan jumlah up-vote dan down-vote', () => {
    render(<VoteButtons upVotesBy={['a', 'b']} downVotesBy={['c']} userId='z' onVote={() => {}} />)
    expect(screen.getByRole('button', { name: 'Up-vote' })).toHaveTextContent('2')
    expect(screen.getByRole('button', { name: 'Down-vote' })).toHaveTextContent('1')
  })

  it('menandai tombol up-vote aktif saat pengguna sudah up-vote', () => {
    render(<VoteButtons upVotesBy={['u1']} downVotesBy={[]} userId='u1' onVote={() => {}} />)
    expect(screen.getByRole('button', { name: 'Up-vote' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Down-vote' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('tidak menandai tombol aktif saat pengguna belum login', () => {
    render(<VoteButtons upVotesBy={['u1']} downVotesBy={['u2']} onVote={() => {}} />)
    expect(screen.getByRole('button', { name: 'Up-vote' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Down-vote' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('memanggil onVote dengan tipe yang sesuai saat tombol ditekan', async () => {
    const onVote = vi.fn()
    render(<VoteButtons upVotesBy={[]} downVotesBy={[]} userId='u1' onVote={onVote} />)

    await userEvent.click(screen.getByRole('button', { name: 'Up-vote' }))
    await userEvent.click(screen.getByRole('button', { name: 'Down-vote' }))

    expect(onVote).toHaveBeenNthCalledWith(1, 'up')
    expect(onVote).toHaveBeenNthCalledWith(2, 'down')
  })
})
