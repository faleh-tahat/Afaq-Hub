import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateContact } from '@/lib/contact-validation';
import { rateLimit } from '@/lib/rate-limit';
import { readBodyLimited } from '@/lib/read-body';
import { getClientIp, logSecurityEvent } from '@/lib/security-log';

const CONTACT_INBOX = 'afaqteam12@gmail.com';

const MAX_BODY_BYTES = 32 * 1024;
// Per visitor: 5 submissions per 10 minutes.
const IP_LIMIT = 5;
const IP_WINDOW_MS = 10 * 60 * 1000;
// Site-wide cap on emails actually sent, so a botnet cannot burn the Resend
// quota or flood the inbox.
const GLOBAL_LIMIT = 60;
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;

const MESSAGES = {
  missing: 'الرجاء تعبئة جميع الحقول.',
  invalid_email: 'الرجاء إدخال بريد إلكتروني صحيح.',
  too_long: 'الرسالة أطول من الحد المسموح.',
  forbidden: 'طلب غير مسموح.',
  rate_limited: 'تم إرسال عدد كبير من الرسائل. الرجاء المحاولة بعد قليل.',
  unexpected: 'حدث خطأ غير متوقع.',
} as const;

function reject(
  request: Request,
  status: number,
  reason: keyof typeof MESSAGES,
  headers?: HeadersInit
) {
  logSecurityEvent(status === 429 ? 'contact.rate_limited' : 'contact.rejected', request, {
    reason,
    status,
  });
  return NextResponse.json({ error: MESSAGES[reason] }, { status, headers });
}

// Browsers always send Origin on cross-site POSTs; refusing foreign origins
// stops other sites from submitting the form on a visitor's behalf.
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (originHost === host) return true;
  const allowed = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return allowed.includes(origin);
}

export async function POST(request: Request) {
  try {
    if (!isAllowedOrigin(request)) return reject(request, 403, 'forbidden');

    // Only the site's own fetch() is accepted; a plain HTML form cannot send
    // this content type without a CORS preflight.
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('application/json')) {
      return reject(request, 415, 'forbidden');
    }

    const ipLimit = await rateLimit(`contact:${getClientIp(request)}`, IP_LIMIT, IP_WINDOW_MS);
    if (!ipLimit.allowed) {
      return reject(request, 429, 'rate_limited', {
        'Retry-After': String(ipLimit.retryAfterSeconds),
      });
    }

    const raw = await readBodyLimited(request, MAX_BODY_BYTES);
    if (raw === null) return reject(request, 413, 'too_long');

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return reject(request, 400, 'missing');
    }

    const result = validateContact(body);
    if (!result.ok) return reject(request, 400, result.reason);
    const { name, email, message } = result.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured.');
      return NextResponse.json(
        { error: 'خدمة الإرسال غير مُفعّلة حاليًا. الرجاء المحاولة لاحقًا.' },
        { status: 500 }
      );
    }

    const globalLimit = await rateLimit('contact:global', GLOBAL_LIMIT, GLOBAL_WINDOW_MS);
    if (!globalLimit.allowed) {
      return reject(request, 429, 'rate_limited', {
        'Retry-After': String(globalLimit.retryAfterSeconds),
      });
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'نموذج تواصل AFAQ <onboarding@resend.dev>',
      to: CONTACT_INBOX,
      replyTo: email,
      subject: `رسالة جديدة من ${name} — نموذج التواصل`,
      text: `الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`,
    });

    if (error) {
      // Log the provider's error name only; its message can echo addresses.
      console.error('Resend error:', error.name);
      logSecurityEvent('contact.send_failed', request, { provider: 'resend' });
      return NextResponse.json({ error: 'تعذّر إرسال الرسالة. حاول مرة أخرى.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err instanceof Error ? err.name : 'unknown');
    return NextResponse.json({ error: MESSAGES.unexpected }, { status: 500 });
  }
}
