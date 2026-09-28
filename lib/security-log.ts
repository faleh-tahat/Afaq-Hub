import { createHash } from 'node:crypto';

// Header holding the real client IP. Vercel overwrites x-forwarded-for, so it
// is safe there; behind Cloudflare set CLIENT_IP_HEADER=cf-connecting-ip.
// Never trust a header the edge in front of the app does not overwrite.
const IP_HEADER = (process.env.CLIENT_IP_HEADER || 'x-forwarded-for').toLowerCase();

export function getClientIp(request: Request): string {
  const raw = request.headers.get(IP_HEADER) || request.headers.get('x-real-ip') || '';
  const first = raw.split(',')[0]?.trim();
  return first || 'unknown';
}

// Logs identify repeat offenders without storing the raw IP (personal data).
export function hashIp(ip: string): string {
  const salt = process.env.SECURITY_LOG_SALT || 'afaq';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 16);
}

type SecurityEvent =
  | 'contact.rate_limited'
  | 'contact.rejected'
  | 'contact.send_failed'
  | 'csp.violation';

// One JSON line per event so hosting log search/alerts can filter on it.
// Callers must never pass form contents, emails or secrets in `details`.
export function logSecurityEvent(
  event: SecurityEvent,
  request: Request,
  details: Record<string, string | number | boolean> = {}
): void {
  console.warn(
    JSON.stringify({
      type: 'security',
      event,
      ipHash: hashIp(getClientIp(request)),
      time: new Date().toISOString(),
      ...details,
    })
  );
}
