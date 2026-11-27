/**
 * Skenario pengujian loading reducer
 *
 * - saat diberi action showLoading
 *   - harus menambah penghitung request yang berjalan
 * - saat diberi action hideLoading
 *   - harus mengurangi penghitung
 *   - tidak boleh turun di bawah nol
 * - saat beberapa request berjalan bersamaan
 *   - loading baru berhenti setelah semua request selesai
 */
import { describe, it, expect } from 'vitest'
import reducer, { showLoading, hideLoading } from './loading'

describe('loading reducer', () => {
  it('menambah penghitung saat showLoading', () => {
    expect(reducer(0, showLoading())).toBe(1)
  })

  it('mengurangi penghitung saat hideLoading', () => {
    expect(reducer(2, hideLoading())).toBe(1)
  })

  it('tidak turun di bawah nol saat hideLoading berlebih', () => {
    expect(reducer(0, hideLoading())).toBe(0)
  })

  it('baru berhenti setelah semua request selesai', () => {
    let state = reducer(0, showLoading())
    state = reducer(state, showLoading())
    state = reducer(state, hideLoading())
    expect(state).toBe(1)
    expect(reducer(state, hideLoading())).toBe(0)
  })
})
