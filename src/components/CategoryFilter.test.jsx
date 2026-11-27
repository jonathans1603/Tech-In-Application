/**
 * Skenario pengujian komponen CategoryFilter
 *
 * - saat dirender
 *   - harus menampilkan chip "Semua" dan satu chip untuk tiap kategori
 *   - chip kategori terpilih harus diberi kelas aktif
 * - saat chip kategori ditekan
 *   - harus memanggil onSelect dengan nama kategori tersebut
 * - saat chip kategori yang sedang aktif ditekan lagi
 *   - harus memanggil onSelect dengan null (filter dilepas)
 * - saat chip "Semua" ditekan
 *   - harus memanggil onSelect dengan null
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryFilter from './CategoryFilter'

describe('CategoryFilter', () => {
  it('menampilkan chip Semua dan chip tiap kategori dengan penanda aktif', () => {
    render(<CategoryFilter categories={['react', 'redux']} selected='redux' onSelect={() => {}} />)
    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '#react' })).not.toHaveClass('chip--active')
    expect(screen.getByRole('button', { name: '#redux' })).toHaveClass('chip--active')
  })

  it('memanggil onSelect dengan nama kategori saat chip ditekan', async () => {
    const onSelect = vi.fn()
    render(<CategoryFilter categories={['react']} selected={null} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: '#react' }))
    expect(onSelect).toHaveBeenCalledWith('react')
  })

  it('memanggil onSelect dengan null saat chip aktif ditekan lagi', async () => {
    const onSelect = vi.fn()
    render(<CategoryFilter categories={['react']} selected='react' onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: '#react' }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })

  it('memanggil onSelect dengan null saat chip Semua ditekan', async () => {
    const onSelect = vi.fn()
    render(<CategoryFilter categories={['react']} selected='react' onSelect={onSelect} />)
    await userEvent.click(screen.getByRole('button', { name: 'Semua' }))
    expect(onSelect).toHaveBeenCalledWith(null)
  })
})
