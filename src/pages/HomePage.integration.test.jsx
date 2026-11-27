/**
 * Skenario pengujian integrasi HomePage + Redux store + thunk
 *
 * - saat halaman dibuka
 *   - harus mengambil users dan threads dari API (di-mock)
 *   - harus menampilkan seluruh thread beserta nama pembuatnya
 * - saat chip kategori ditekan
 *   - harus hanya menampilkan thread dengan kategori tersebut
 * - saat chip "Semua" ditekan
 *   - harus menampilkan seluruh thread kembali
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import api from '../api'
import store from '../states'
import HomePage from './HomePage'

vi.mock('../api', () => ({
  default: { getAllUsers: vi.fn(), getAllThreads: vi.fn() },
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn()
}))

const users = [
  { id: 'u1', name: 'Dimas', avatar: 'a.png' },
  { id: 'u2', name: 'Dicoding', avatar: 'b.png' }
]
const makeThread = (id, title, category, ownerId) => ({
  id,
  title,
  body: `isi ${title}`,
  category,
  ownerId,
  createdAt: '2023-05-29T14:54:35.000Z',
  totalComments: 0,
  upVotesBy: [],
  downVotesBy: []
})

describe('HomePage (integrasi)', () => {
  beforeEach(() => {
    api.getAllUsers.mockResolvedValue(users)
    api.getAllThreads.mockResolvedValue([
      makeThread('t1', 'Pengalaman belajar Redux', 'redux', 'u1'),
      makeThread('t2', 'Perkenalan diri', 'perkenalan', 'u2')
    ])
    render(
      <Provider store={store}>
        <MemoryRouter><HomePage /></MemoryRouter>
      </Provider>
    )
  })

  it('menampilkan semua thread beserta nama pembuatnya setelah data dimuat', async () => {
    expect(await screen.findByText('Pengalaman belajar Redux')).toBeInTheDocument()
    expect(screen.getByText('Perkenalan diri')).toBeInTheDocument()
    expect(screen.getByText('Dimas')).toBeInTheDocument()
    expect(screen.getByText('Dicoding')).toBeInTheDocument()
  })

  it('memfilter thread berdasarkan kategori lalu menampilkannya kembali lewat Semua', async () => {
    await screen.findByText('Pengalaman belajar Redux')

    await userEvent.click(screen.getByRole('button', { name: '#redux' }))
    expect(screen.getByText('Pengalaman belajar Redux')).toBeInTheDocument()
    expect(screen.queryByText('Perkenalan diri')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Semua' }))
    await waitFor(() => expect(screen.getByText('Perkenalan diri')).toBeInTheDocument())
  })
})
