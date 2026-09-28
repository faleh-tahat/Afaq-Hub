// Enforced policy: unchanged from before, so nothing on the page can break.
const contentSecurityPolicy =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' fonts.googleapis.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com; font-src 'self' fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https:;";

// Stricter candidate policy, reported only (never blocks). Violations are
// posted to /api/csp-report; once clean it can replace the policy above.
// Fonts are self-hosted by next/font, so no Google origins are needed.
// 'unsafe-inline' stays for scripts because pages are statically generated
// (nonces would force dynamic rendering) and for framer-motion style attributes.
const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'report-uri /api/csp-report',
].join('; ');

const securityHeaders = [
  // HTTPS only for 2 years. includeSubDomains/preload are left out until every
  // subdomain is confirmed to serve HTTPS (preload is hard to undo).
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  // Legacy XSS auditor is itself exploitable; modern guidance is to disable it.
  { key: 'X-XSS-Protection', value: '0' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicyReportOnly },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image Optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    // Only the default quality is used; rejecting others stops attackers from
    // forcing a fresh (CPU-heavy) optimisation per request via ?q=.
    qualities: [75],
  },

  // Security & Caching Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Files in public/ keep their names when replaced, so they must not be
      // cached as immutable. Hashed /_next/static assets are handled by Next.
      {
        source: '/:file((?!_next/)[^?]+\\.(?:jpe?g|png|gif|svg|webp|avif|ico))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // Redirect old URLs if any
    ];
  },

  // Rewrites
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Compression
  compress: true,

  // Generate ETags for all responses
  generateEtags: true,

  // Power UPS
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // Production optimizations
  productionBrowserSourceMaps: false,
  poweredByHeader: false,

  // Trailing slash consistency
  trailingSlash: false,

  // Internationalization (if needed)
  i18n: null,
};

export default nextConfig;
