/**
 * @jest-environment node
 */
const send = jest.fn()
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send } })),
}))

import { POST } from '@/app/api/contact/route'
import { resetRateLimits } from '@/lib/rate-limit'

const valid = { name: 'Ali', email: 'ali@example.com', message: 'Hello' }

function post(
  body: unknown,
  { headers = {}, ip = '203.0.113.1' }: { headers?: Record<string, string>; ip?: string } = {}
) {
  return new Request('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: {
      host: 'localhost:3000',
      'content-type': 'application/json',
      'x-forwarded-for': ip,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

beforeEach(() => {
  resetRateLimits()
  send.mockReset().mockResolvedValue({ error: null })
  process.env.RESEND_API_KEY = 'test-key'
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => jest.restoreAllMocks())

describe('POST /api/contact', () => {
  it('sends a valid same-origin message exactly as before', async () => {
    const res = await POST(post(valid, { headers: { origin: 'http://localhost:3000' } }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'afaqteam12@gmail.com',
        replyTo: 'ali@example.com',
        subject: 'رسالة جديدة من Ali — نموذج التواصل',
      })
    )
  })

  it('rejects cross-site origins', async () => {
    const res = await POST(post(valid, { headers: { origin: 'https://evil.example' } }))
    expect(res.status).toBe(403)
    expect(send).not.toHaveBeenCalled()
  })

  it('rejects non-JSON content types (form-based CSRF)', async () => {
    const res = await POST(post(valid, { headers: { 'content-type': 'text/plain' } }))
    expect(res.status).toBe(415)
  })

  it('returns 400 (not 500) for malformed JSON', async () => {
    const res = await POST(post('{not json'))
    expect(res.status).toBe(400)
  })

  it('returns 400 for an invalid email', async () => {
    const res = await POST(post({ ...valid, email: 'nope' }))
    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it('returns 413 for oversized bodies', async () => {
    const res = await POST(post({ ...valid, message: 'x'.repeat(40_000) }))
    expect(res.status).toBe(413)
  })

  it('rate-limits a single client after 5 attempts', async () => {
    for (let i = 0; i < 5; i++) {
      expect((await POST(post(valid))).status).toBe(200)
    }
    const res = await POST(post(valid))
    expect(res.status).toBe(429)
    expect(res.headers.get('retry-after')).toBeTruthy()
    // A different visitor is unaffected.
    expect((await POST(post(valid, { ip: '203.0.113.2' }))).status).toBe(200)
  })

  it('never logs form contents', async () => {
    const warn = console.warn as jest.Mock
    await POST(post({ ...valid, email: 'secret-person@nope' }))
    const logged = warn.mock.calls.flat().join(' ')
    expect(logged).not.toContain('secret-person')
    expect(logged).not.toContain('203.0.113.1')
  })
})
