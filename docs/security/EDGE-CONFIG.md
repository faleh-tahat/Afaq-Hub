# Edge / CDN / WAF configuration (free tiers)

Recommendations only — nothing here is applied automatically. The app already
sends its own security headers and rate-limits `/api/contact`; the edge adds a
first line of defence that stops abusive traffic before it reaches Next.js.

Pick **one** front door: Cloudflare in front of Vercel, *or* Vercel alone.

---

## Option A — Cloudflare Free in front of the site

### SSL/TLS
- SSL/TLS mode: **Full (strict)**
- Edge Certificates → **Always Use HTTPS**: on
- Minimum TLS version: **1.2**
- Automatic HTTPS Rewrites: on
- HSTS: leave off here — the app already sends it (avoid two sources of truth).

### Security
- **Bot Fight Mode**: on
- Security level: Medium
- Browser Integrity Check: on

### WAF → Custom rules (5 free)
1. **Block scanner paths** — action *Block*
   ```
   (http.request.uri.path contains "/.env") or
   (http.request.uri.path contains "/.git") or
   (http.request.uri.path contains "wp-admin") or
   (http.request.uri.path contains "wp-login") or
   (http.request.uri.path contains "phpmyadmin") or
   (http.request.uri.path contains ".php")
   ```
2. **Only expected methods** — action *Block*
   ```
   not (http.request.method in {"GET" "HEAD" "POST" "OPTIONS"})
   ```
3. **POST only to the two API endpoints** — action *Block*
   ```
   (http.request.method eq "POST") and
   not (http.request.uri.path in {"/api/contact" "/api/csp-report"})
   ```

### WAF → Rate limiting rules (1 free)
- If: `http.request.uri.path eq "/api/contact" and http.request.method eq "POST"`
- Characteristics: IP
- Rate: **3 requests / 10 seconds**, action *Block* for 10 seconds

### Speed
- Brotli: on (default)
- Caching → Cache Rules: *Cache everything* is **not** needed; Cloudflare
  already caches `/_next/static/*` and images from their `Cache-Control`
  headers. Pages use `s-maxage`, which Cloudflare respects.

### App settings when behind Cloudflare
Set `CLIENT_IP_HEADER=cf-connecting-ip` so rate limits key on the real
visitor IP. **Only** do this when all traffic goes through Cloudflare —
otherwise the header can be forged.

---

## Option B — Vercel only (Hobby)

- Vercel already terminates TLS, sends HSTS and serves Brotli.
- Firewall → **Attack Challenge Mode**: turn on during an attack.
- Firewall → Custom rules: add the scanner-path and method rules above
  (Vercel's rule builder has the same conditions).
- If your plan includes WAF rate limiting, add the `/api/contact` rule above.
- `x-forwarded-for` is overwritten by Vercel, so the default
  `CLIENT_IP_HEADER` is correct.

---

## Shared rate limits across instances (optional, free)

In-memory limits are per server instance. For one shared counter:

1. Create a free database at <https://upstash.com> (Redis).
2. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to the
   hosting environment variables. No code change is needed.

---

## Promoting the Report-Only CSP

`next.config.mjs` sends a stricter `Content-Security-Policy-Report-Only`.
Violations are logged as JSON lines with `"event":"csp.violation"`.
Once production logs show none for a couple of weeks, move
`contentSecurityPolicyReportOnly` into the enforced
`Content-Security-Policy` header (and remove `report-uri` if unwanted).

## Stronger HSTS (later)

After confirming every subdomain of `afaq-team.com` serves HTTPS, change HSTS
to `max-age=63072000; includeSubDomains; preload` and submit the domain at
<https://hstspreload.org>. Preload is slow to undo, so do this last.
