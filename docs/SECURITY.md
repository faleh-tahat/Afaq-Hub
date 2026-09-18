# Security Guidelines

## Overview

This document outlines security best practices and implementation for AFAQ Tech Team.

## Security Headers

All security headers are configured in `next.config.mjs`:

### Content-Security-Policy (CSP)

Restricts resource loading to prevent XSS attacks:

```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval' fonts.googleapis.com
style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com
font-src 'self' fonts.gstatic.com data:
img-src 'self' data: https:
connect-src 'self' https:
```

### X-Frame-Options

Prevents clickjacking attacks:
```
X-Frame-Options: SAMEORIGIN
```

### X-Content-Type-Options

Prevents MIME sniffing:
```
X-Content-Type-Options: nosniff
```

### Referrer-Policy

Controls referrer information:
```
Referrer-Policy: strict-origin-when-cross-origin
```

## HTTPS

- **Production**: Always use HTTPS
- **Certificates**: Use valid SSL/TLS certificates
- **HSTS**: Enable with long max-age (1 year minimum)
- **Mixed Content**: Avoid loading HTTP resources from HTTPS pages

## Authentication & Authorization

### Current Implementation

Currently, the site is public. For future authenticated features:

- Use secure session management
- Hash passwords with bcrypt or argon2
- Implement proper logout
- Use CSRF tokens for state-changing requests
- Implement rate limiting

### Future Implementation

```typescript
// Example authenticated route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const session = await getSession(request)
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Authenticated logic
}
```

## Input Validation

Always validate and sanitize user input:

```typescript
// Server-side validation
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1).max(1000),
})

const validated = schema.parse(formData)
```

## Secrets Management

### Environment Variables

Never commit secrets to version control:

```bash
# .env.local (gitignored)
NEXT_PUBLIC_SITE_URL=https://afaq-team.com
DATABASE_URL=postgresql://user:pass@host/db
API_KEY=secret-key-here

# .env.example (public template)
NEXT_PUBLIC_SITE_URL=https://afaq-team.com
DATABASE_URL=
API_KEY=
```

### Accessing Secrets

- **Client-side**: Only use `NEXT_PUBLIC_*` variables
- **Server-side**: Use any variable in API routes or Server Components

```typescript
// ✅ Client component
const url = process.env.NEXT_PUBLIC_SITE_URL

// ❌ Won't work in client
const dbUrl = process.env.DATABASE_URL

// ✅ Works in API routes
export async function GET() {
  const dbUrl = process.env.DATABASE_URL
}
```

## Common Vulnerabilities Prevention

### Cross-Site Scripting (XSS)

- React escapes content by default
- Use `dangerouslySetInnerHTML` only for trusted content
- Sanitize user-generated content with libraries like `sanitize-html`

```typescript
// ✅ Safe - React escapes
<div>{userContent}</div>

// ❌ Unsafe
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

### Cross-Site Request Forgery (CSRF)

- Use SameSite cookie attribute
- Implement CSRF tokens for state-changing operations
- Validate request origin

### SQL Injection

- Use parameterized queries
- Never concatenate SQL with user input

```typescript
// ✅ Safe - using parameterized query
const user = await db.user.findUnique({
  where: { id: userId }
})

// ❌ Unsafe - never do this
const user = await db.$queryRaw(`SELECT * FROM users WHERE id = ${userId}`)
```

### XML External Entity (XXE)

- Disable DTD processing
- Use safe XML parsers
- Validate XML schemas

## Dependency Security

### Check for Vulnerabilities

```bash
npm audit
npm audit fix
npm audit fix --force  # Only if necessary
```

### Keep Dependencies Updated

```bash
npm outdated           # Check for updates
npm update            # Update to latest minor/patch
npm install @package@latest  # Major version update
```

## Secure Communication

### HTTPS/TLS

- Use strong cipher suites
- Use TLS 1.2 or higher
- Keep certificates updated

### API Communication

- Validate SSL certificates
- Use secure authentication
- Encrypt sensitive data in transit

## Error Handling

### Don't Expose Sensitive Information

```typescript
// ❌ Exposes too much information
export async function GET() {
  try {
    // code
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ✅ Generic error message
export async function GET() {
  try {
    // code
  } catch (error) {
    console.error(error) // Log for debugging
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Security Audit Checklist

Before deployment:

- [ ] All dependencies updated and audited
- [ ] No hardcoded secrets in code
- [ ] Environment variables documented
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Input validation implemented
- [ ] Error messages generic
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Monitoring configured
- [ ] CORS configured properly
- [ ] CSP policy tested
- [ ] SQL injection prevention verified
- [ ] XSS protection verified
- [ ] CSRF protection configured

## Incident Response

### If Compromised

1. **Immediate Actions**
   - Revoke compromised credentials
   - Invalidate active sessions
   - Analyze logs for unauthorized access
   - Block malicious IPs

2. **Investigation**
   - Review access logs
   - Check for data exfiltration
   - Analyze attack vectors
   - Document timeline

3. **Recovery**
   - Deploy patches
   - Restore from clean backups
   - Rotate secrets
   - Notify users if needed

4. **Prevention**
   - Implement monitoring
   - Increase logging
   - Strengthen authentication
   - Conduct security audit

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)

## Support

For security issues:

1. Do NOT create public GitHub issues
2. Email: security@afaq-team.com
3. Include affected component
4. Include reproduction steps
5. Allow 48 hours for response
