export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/private/'],
      },
    ],
    sitemap: 'https://afaq-team.com/sitemap.xml',
    host: 'https://afaq-team.com',
  }
}
