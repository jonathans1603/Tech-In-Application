/**
 * Skenario pengujian komponen LoginInput
 *
 * - saat dirender
 *   - harus menampilkan input email, input password, dan tombol Masuk
 * - saat pengguna mengetik email dan password
 *   - nilai input harus ikut berubah
 * - saat form dikirim
 *   - harus memanggil onLogin dengan email dan password yang diketik
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginInput from './LoginInput'

describe('LoginInput', () => {
  it('menampilkan input email, password, dan tombol Masuk', () => {
    render(<LoginInput onLogin={() => {}} />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument()
  })

  it('memperbarui nilai input saat pengguna mengetik', async () => {
    render(<LoginInput onLogin={() => {}} />)
    await userEvent.type(screen.getByPlaceholderText('Email'), 'budi@mail.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'rahasia')

    expect(screen.getByPlaceholderText('Email')).toHaveValue('budi@mail.com')
    expect(screen.getByPlaceholderText('Password')).toHaveValue('rahasia')
  })

  it('memanggil onLogin dengan email dan password saat form dikirim', async () => {
    const onLogin = vi.fn()
    render(<LoginInput onLogin={onLogin} />)

    await userEvent.type(screen.getByPlaceholderText('Email'), 'budi@mail.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'rahasia')
    await userEvent.click(screen.getByRole('button', { name: 'Masuk' }))

    expect(onLogin).toHaveBeenCalledWith({ email: 'budi@mail.com', password: 'rahasia' })
  })
})
