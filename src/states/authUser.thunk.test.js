/**
 * Skenario pengujian thunk asyncLogin dan asyncRegister
 *
 * - asyncLogin
 *   - saat login berhasil
 *     - harus menyimpan token, mengambil profil, dan men-dispatch setAuthUser
 *     - harus mengembalikan true
 *     - harus memanggil showLoading di awal dan hideLoading di akhir
 *   - saat login gagal
 *     - harus menampilkan alert berisi pesan error dan mengembalikan false
 *     - tidak boleh menyimpan token
 *     - tetap memanggil hideLoading
 * - asyncRegister
 *   - saat berhasil harus mengembalikan true
 *   - saat gagal harus menampilkan alert dan mengembalikan false
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import api, { putAccessToken } from '../api'
import { asyncLogin, asyncRegister, setAuthUser } from './authUser'
import { showLoading, hideLoading } from './loading'

vi.mock('../api', () => ({
  default: { login: vi.fn(), getOwnProfile: vi.fn(), register: vi.fn() },
  putAccessToken: vi.fn(),
  removeAccessToken: vi.fn()
}))

const fakeUser = { id: 'u1', name: 'Budi', email: 'budi@mail.com', avatar: 'a.png' }

describe('thunk asyncLogin', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('menyimpan token dan men-dispatch setAuthUser saat login berhasil', async () => {
    api.login.mockResolvedValue('token-abc')
    api.getOwnProfile.mockResolvedValue(fakeUser)
    const dispatch = vi.fn()

    const result = await asyncLogin({ email: 'budi@mail.com', password: 'rahasia' })(dispatch)

    expect(putAccessToken).toHaveBeenCalledWith('token-abc')
    expect(dispatch).toHaveBeenCalledWith(showLoading())
    expect(dispatch).toHaveBeenCalledWith(setAuthUser(fakeUser))
    expect(dispatch).toHaveBeenLastCalledWith(hideLoading())
    expect(result).toBe(true)
  })

  it('menampilkan alert dan mengembalikan false saat login gagal', async () => {
    api.login.mockRejectedValue(new Error('Password salah'))
    const dispatch = vi.fn()

    const result = await asyncLogin({ email: 'budi@mail.com', password: 'x' })(dispatch)

    expect(window.alert).toHaveBeenCalledWith('Password salah')
    expect(putAccessToken).not.toHaveBeenCalled()
    expect(dispatch).not.toHaveBeenCalledWith(setAuthUser(fakeUser))
    expect(dispatch).toHaveBeenLastCalledWith(hideLoading())
    expect(result).toBe(false)
  })
})

describe('thunk asyncRegister', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('mengembalikan true saat pendaftaran berhasil', async () => {
    api.register.mockResolvedValue(fakeUser)
    const dispatch = vi.fn()
    expect(await asyncRegister({ name: 'Budi', email: 'b@mail.com', password: '123456' })(dispatch)).toBe(true)
    expect(dispatch).toHaveBeenLastCalledWith(hideLoading())
  })

  it('menampilkan alert dan mengembalikan false saat email sudah dipakai', async () => {
    api.register.mockRejectedValue(new Error('Email sudah digunakan'))
    const dispatch = vi.fn()
    expect(await asyncRegister({ name: 'Budi', email: 'b@mail.com', password: '123456' })(dispatch)).toBe(false)
    expect(window.alert).toHaveBeenCalledWith('Email sudah digunakan')
  })
})
