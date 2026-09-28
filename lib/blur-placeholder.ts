// A shared shimmer placeholder for next/image's `blur` mode, for images
// whose `src` is a dynamic string path rather than a static import (which is
// the only case Next.js can auto-generate a real blurDataURL for). Same
// technique as Next.js's own docs recommend for this scenario.
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#171A21" offset="20%" />
      <stop stop-color="#1E222B" offset="50%" />
      <stop stop-color="#171A21" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#101216" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export const shimmerBlurDataURL = (w = 700, h = 475) =>
  `data:image/svg+xml;base64,${toBase64(shimmer(w, h))}`;
