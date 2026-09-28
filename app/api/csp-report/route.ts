import { rateLimit } from '@/lib/rate-limit';
import { readBodyLimited } from '@/lib/read-body';
import { getClientIp, logSecurityEvent } from '@/lib/security-log';

const MAX_BODY_BYTES = 8 * 1024;

function pathOf(uri: unknown): string {
  if (typeof uri !== 'string') return '';
  try {
    return new URL(uri).pathname.slice(0, 200);
  } catch {
    return uri.slice(0, 200);
  }
}

// Receives Content-Security-Policy-Report-Only violations so the stricter
// policy can be checked against real traffic before it is enforced.
export async function POST(request: Request) {
  const noContent = new Response(null, { status: 204 });

  const { allowed } = await rateLimit(`csp:${getClientIp(request)}`, 30, 60_000);
  if (!allowed) return noContent;

  const body = await readBodyLimited(request, MAX_BODY_BYTES);
  if (body === null) return noContent;

  try {
    const parsed = JSON.parse(body);
    // application/csp-report sends one object; application/reports+json an array.
    const reports: Record<string, unknown>[] = Array.isArray(parsed)
      ? parsed.map((r) => r?.body ?? {})
      : [parsed?.['csp-report'] ?? {}];

    for (const r of reports.slice(0, 10)) {
      logSecurityEvent('csp.violation', request, {
        directive: String(r['violated-directive'] ?? r['effectiveDirective'] ?? '').slice(0, 100),
        blocked: String(r['blocked-uri'] ?? r['blockedURL'] ?? '').slice(0, 200),
        page: pathOf(r['document-uri'] ?? r['documentURL']),
      });
    }
  } catch {
    // Malformed reports are ignored.
  }

  return noContent;
}
