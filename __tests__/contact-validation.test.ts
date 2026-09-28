import { validateContact, CONTACT_LIMITS } from '@/lib/contact-validation'

const valid = { name: 'أحمد', email: 'ahmad@example.com', message: 'مرحبا' }

describe('validateContact', () => {
  it('accepts a normal submission', () => {
    expect(validateContact(valid)).toEqual({ ok: true, data: valid })
  })

  it('trims surrounding whitespace', () => {
    const r = validateContact({ name: ' a ', email: ' a@b.co ', message: ' hi ' })
    expect(r).toEqual({ ok: true, data: { name: 'a', email: 'a@b.co', message: 'hi' } })
  })

  it.each([null, 'x', {}, { ...valid, name: '' }, { ...valid, email: 5 }, { ...valid, message: '   ' }])(
    'rejects missing fields: %p',
    (input) => {
      expect(validateContact(input)).toEqual({ ok: false, reason: 'missing' })
    }
  )

  it.each(['plain', 'a@b', 'a b@c.com', 'a@b.com\nBcc: x@y.com', '<a@b.com>', 'a@b.com,c@d.com'])(
    'rejects invalid email %p',
    (email) => {
      expect(validateContact({ ...valid, email })).toEqual({ ok: false, reason: 'invalid_email' })
    }
  )

  it('strips line breaks from the name (subject header)', () => {
    const r = validateContact({ ...valid, name: 'Ali\r\nBcc: evil@x.com' })
    expect(r.ok && r.data.name).toBe('Ali Bcc: evil@x.com')
  })

  it('keeps line breaks in the message', () => {
    const r = validateContact({ ...valid, message: 'line1\nline2' })
    expect(r.ok && r.data.message).toBe('line1\nline2')
  })

  it('rejects over-long fields', () => {
    expect(validateContact({ ...valid, name: 'a'.repeat(CONTACT_LIMITS.name + 1) })).toEqual({
      ok: false,
      reason: 'too_long',
    })
    expect(validateContact({ ...valid, message: 'a'.repeat(CONTACT_LIMITS.message + 1) })).toEqual({
      ok: false,
      reason: 'too_long',
    })
  })
})
