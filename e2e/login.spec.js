/**
 * Skenario pengujian End-to-End alur login
 *
 * - saat pengguna membuka /login lalu memasukkan email dan password yang benar
 *   - harus diarahkan ke beranda
 *   - harus menampilkan avatar dan tombol Keluar di navigasi
 * - saat pengguna memasukkan password yang salah
 *   - harus menampilkan pesan error dan tetap berada di halaman login
 * - saat pengguna yang sudah login menekan Keluar
 *   - harus kembali ke kondisi belum login (tombol Masuk muncul lagi)
 *
 * Seluruh respons Forum API di-mock agar pengujian stabil dan tidak
 * bergantung pada jaringan maupun akun sungguhan.
 */
import { test, expect } from '@playwright/test'

const API = 'https://forum-api.dicoding.dev/v1'
const avatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
const user = { id: 'user-1', name: 'Budi', email: 'budi@mail.com', avatar }
const ok = (data) => ({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'success', message: 'ok', data }) })
const fail = (status, message) => ({ status, contentType: 'application/json', body: JSON.stringify({ status: 'fail', message }) })

async function mockApi (page) {
  await page.route(`${API}/**`, (route) => {
    const request = route.request()
    const { pathname } = new URL(request.url())
    const path = pathname.replace('/v1', '')

    if (path === '/login') {
      const { password } = request.postDataJSON()
      return route.fulfill(password === 'rahasia' ? ok({ token: 'test-token' }) : fail(400, 'email or password is wrong'))
    }
    if (path === '/users/me') {
      const authorized = request.headers().authorization === 'Bearer test-token'
      return route.fulfill(authorized ? ok({ user }) : fail(401, 'Missing authentication'))
    }
    if (path === '/users') return route.fulfill(ok({ users: [user] }))
    if (path === '/threads') {
      return route.fulfill(ok({
        threads: [{
          id: 'thread-1',
          title: 'Thread uji e2e',
          body: 'isi thread',
          category: 'react',
          ownerId: 'user-1',
          createdAt: '2023-05-29T14:54:35.000Z',
          totalComments: 0,
          upVotesBy: [],
          downVotesBy: []
        }]
      }))
    }
    return route.fulfill(fail(404, 'not found'))
  })
}

test.describe('alur login', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page)
  })

  test('login berhasil mengarahkan ke beranda dan menampilkan tombol Keluar', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Email').fill('budi@mail.com')
    await page.getByPlaceholder('Password').fill('rahasia')
    await page.getByRole('button', { name: 'Masuk' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('button', { name: 'Keluar' })).toBeVisible()
    await expect(page.getByText('Thread uji e2e')).toBeVisible()
  })

  test('login gagal menampilkan pesan error dan tetap di halaman login', async ({ page }) => {
    let message = ''
    page.on('dialog', async (dialog) => {
      message = dialog.message()
      await dialog.accept()
    })

    await page.goto('/login')
    await page.getByPlaceholder('Email').fill('budi@mail.com')
    await page.getByPlaceholder('Password').fill('salah')
    await page.getByRole('button', { name: 'Masuk' }).click()

    await expect.poll(() => message).toBe('email or password is wrong')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('keluar mengembalikan pengguna ke kondisi belum login', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder('Email').fill('budi@mail.com')
    await page.getByPlaceholder('Password').fill('rahasia')
    await page.getByRole('button', { name: 'Masuk' }).click()
    await page.getByRole('button', { name: 'Keluar' }).click()

    await expect(page.getByRole('link', { name: 'Masuk' }).first()).toBeVisible()
  })
})
