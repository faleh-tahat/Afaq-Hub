// One-off audit script (not part of the app or its test suite).
// Usage: node design-audit/capture.mjs <before|after>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] === 'after' ? 'after' : 'before';
const BASE = 'http://localhost:3000';
const OUT_DIR = path.join('design-audit', mode);
const CONTENT_FILE = path.join('design-audit', `content-${mode}.json`);

const ROUTES = [
  '/',
  '/about',
  '/committees',
  '/events',
  '/projects',
  '/news',
  '/gallery',
  '/partners',
  '/join-us',
  '/contact',
  '/faq',
  '/privacy-policy',
  '/terms',
  '/this-route-does-not-exist-404-check',
];

const WIDTHS = [
  { name: '390', width: 390, height: 844 },
  { name: '1440', width: 1440, height: 900 },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

const routeSlug = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-'));

const browser = await chromium.launch();
const content = {};

for (const route of ROUTES) {
  const slug = routeSlug(route) === '404-check' || route.includes('does-not-exist') ? '404' : routeSlug(route);

  for (const vp of WIDTHS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const res = await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 }).catch((e) => {
      console.error(`Failed to load ${route} @ ${vp.name}:`, e.message);
      return null;
    });
    await page.waitForTimeout(300);

    // Scroll through the whole page first so framer-motion's `whileInView`
    // reveal animations actually fire before the screenshot, otherwise
    // unvisited sections capture as blank (opacity: 0).
    await page.evaluate(async () => {
      const step = 400;
      const delay = 60;
      let y = 0;
      const height = document.body.scrollHeight;
      while (y < height) {
        window.scrollBy(0, step);
        y += step;
        await new Promise((r) => setTimeout(r, delay));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400); // settle animations back at top

    // Resize the viewport to the full document height and take a single
    // non-scrolling screenshot. `fullPage: true` internally scrolls and
    // stitches, which visually duplicates/clips `position: sticky` elements
    // (e.g. the header) over the content right below them.
    const fullHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewportSize({ width: vp.width, height: Math.ceil(fullHeight) });
    await page.waitForTimeout(150);

    const shotPath = path.join(OUT_DIR, `${slug}-${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Saved ${shotPath} (status ${res ? res.status() : 'error'})`);

    if (vp.name === '1440') {
      const snapshot = await page.evaluate(() => {
        const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
        const imgs = Array.from(document.querySelectorAll('img')).map((img) => ({
          src: img.getAttribute('src'),
          alt: img.getAttribute('alt'),
        }));
        const links = Array.from(document.querySelectorAll('a[href]')).map((a) => ({
          href: a.getAttribute('href'),
          text: norm(a.textContent),
        }));
        return {
          text: norm(document.body.innerText),
          imgs,
          links,
        };
      });
      content[route] = snapshot;
    }

    await page.close();
  }
}

await browser.close();
fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');
console.log(`Wrote ${CONTENT_FILE}`);
