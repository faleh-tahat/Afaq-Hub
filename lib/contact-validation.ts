export const CONTACT_LIMITS = {
  name: 100,
  email: 254, // RFC 5321 maximum
  message: 10_000,
} as const;

export type ContactInput = { name: string; email: string; message: string };

export type ContactValidation =
  | { ok: true; data: ContactInput }
  | { ok: false; reason: 'missing' | 'invalid_email' | 'too_long' };

// Same shape browsers accept for <input type="email">: no spaces, quotes or
// angle brackets, so the address cannot smuggle extra headers or recipients.
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]+/g;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_EXCEPT_NEWLINE_TAB = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function validateContact(input: unknown): ContactValidation {
  if (!input || typeof input !== 'object') return { ok: false, reason: 'missing' };
  const { name, email, message } = input as Record<string, unknown>;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof message !== 'string' || !message.trim()
  ) {
    return { ok: false, reason: 'missing' };
  }

  // The name ends up in the email subject: collapse line breaks and other
  // control characters so it stays a single header line.
  const cleanName = name.replace(CONTROL_CHARS, ' ').trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.replace(CONTROL_CHARS_EXCEPT_NEWLINE_TAB, '').trim();

  if (
    cleanName.length > CONTACT_LIMITS.name ||
    cleanEmail.length > CONTACT_LIMITS.email ||
    cleanMessage.length > CONTACT_LIMITS.message
  ) {
    return { ok: false, reason: 'too_long' };
  }

  if (!EMAIL_RE.test(cleanEmail)) return { ok: false, reason: 'invalid_email' };
  if (!cleanName || !cleanMessage) return { ok: false, reason: 'missing' };

  return { ok: true, data: { name: cleanName, email: cleanEmail, message: cleanMessage } };
}
