/**
 * Skenario pengujian komponen ThreadItem
 *
 * - saat dirender
 *   - harus menampilkan judul sebagai link ke halaman detail
 *   - harus menampilkan potongan isi tanpa tag HTML
 *   - harus menampilkan jumlah komentar dan nama pembuat
 * - saat isi thread lebih dari 160 karakter
 *   - harus dipotong dan diakhiri tanda elipsis
 * - saat pengguna login dan klik dua kali isi thread
 *   - harus memanggil onVote dengan (id, 'up')
 * - saat pengguna sudah menyukai thread dan klik dua kali
 *   - tidak boleh memanggil onVote lagi (agar tidak mencabut like)
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ThreadItem from './ThreadItem'

const baseThread = {
  id: 'thread-1',
  title: 'Belajar Redux',
  body: '<p>Halo <b>dunia</b></p>',
  category: 'redux',
  createdAt: '2023-05-29T14:54:35.000Z',
  totalComments: 3,
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'u1', name: 'Dimas', avatar: 'a.png' }
}

const setup = (thread, authUserId, onVote = vi.fn()) => {
  render(
    <MemoryRouter>
      <ThreadItem thread={thread} authUserId={authUserId} onVote={onVote} />
    </MemoryRouter>
  )
  return onVote
}

describe('ThreadItem', () => {
  it('menampilkan judul sebagai link, potongan isi tanpa HTML, komentar, dan pembuat', () => {
    setup(baseThread, 'u2')
    expect(screen.getByRole('link', { name: 'Belajar Redux' })).toHaveAttribute('href', '/threads/thread-1')
    expect(screen.getByText('Halo dunia')).toBeInTheDocument()
    expect(screen.getByText('Dimas')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Lihat komentar' })).toHaveTextContent('3')
  })

  it('memotong isi yang lebih dari 160 karakter', () => {
    setup({ ...baseThread, body: 'a'.repeat(200) }, 'u2')
    expect(screen.getByText(`${'a'.repeat(160)}…`)).toBeInTheDocument()
  })

  it('memanggil onVote dengan up saat login dan klik dua kali', async () => {
    const onVote = setup(baseThread, 'u2')
    await userEvent.dblClick(screen.getByText('Halo dunia'))
    expect(onVote).toHaveBeenCalledWith('thread-1', 'up')
  })

  it('tidak memanggil onVote saat thread sudah disukai', async () => {
    const onVote = setup({ ...baseThread, upVotesBy: ['u2'] }, 'u2')
    await userEvent.dblClick(screen.getByText('Halo dunia'))
    expect(onVote).not.toHaveBeenCalled()
  })
})
