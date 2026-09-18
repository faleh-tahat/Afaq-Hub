# API Documentation

## Overview

AFAQ Tech Team backend provides endpoints for health checks and monitoring. The API follows RESTful principles and returns JSON responses.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://afaq-team.com`

## Authentication

Currently, no authentication is required for public endpoints. For future authenticated endpoints, Bearer token authentication will be used:

```
Authorization: Bearer <token>
```

## Health Check

### GET `/api/health`

Check application health and uptime.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-07-25T12:00:00Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK` - Application is healthy
- `500 Internal Server Error` - Application has issues

**Example:**
```bash
curl https://afaq-team.com/api/health
```

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2026-07-25T12:00:00Z"
}
```

### Common Error Codes

- `BAD_REQUEST` - Invalid request parameters
- `NOT_FOUND` - Resource not found
- `INTERNAL_SERVER_ERROR` - Server error
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Permission denied

## Rate Limiting

Rate limiting is configured to prevent abuse:

- **Requests**: 100 per 15 minutes per IP
- **Burst**: 10 requests per second

When rate limited, you'll receive:

```
HTTP 429 Too Many Requests
Retry-After: 60
```

## CORS

CORS is configured for the following origins:

- `https://afaq-team.com`
- `https://www.afaq-team.com`
- Development: `http://localhost:3000`, `http://localhost:3001`

## Versioning

API versions are managed via URL versioning:

- Current: `/api/v1/*`
- Deprecated: `/api/v0/*` (support ends in 6 months)

## Response Format

All responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-07-25T12:00:00Z",
  "requestId": "req-12345"
}
```

## Performance

Recommended practices:

1. **Caching**: Cache responses using HTTP caching headers
2. **Compression**: gzip compression is enabled by default
3. **Pagination**: Limit requests for large datasets
4. **Batching**: Combine multiple requests when possible

## Security

- All endpoints use HTTPS in production
- Rate limiting prevents abuse
- CORS prevents unauthorized access
- CSP headers prevent XSS attacks
- Input validation on all endpoints

## Monitoring

API endpoints are monitored for:

- Response time
- Error rate
- Uptime
- Request volume

## Deprecation Policy

Endpoints scheduled for removal will:

1. Be marked as deprecated in documentation
2. Return deprecation warnings in response headers
3. Be supported for minimum 6 months
4. Be removed with notice via changelog

## Support

For API issues:

1. Check health endpoint: `/api/health`
2. Review error response code
3. Check this documentation
4. Contact development team

## Examples

### Health Check

```bash
# Check health
curl https://afaq-team.com/api/health

# With pretty print
curl -s https://afaq-team.com/api/health | jq '.'

# With headers
curl -i https://afaq-team.com/api/health
```

### Monitoring

```bash
# Continuous monitoring
watch -n 5 'curl -s https://afaq-team.com/api/health | jq .'

# Log response times
curl -w "Time: %{time_total}s\n" https://afaq-team.com/api/health
```
