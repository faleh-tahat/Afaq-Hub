// Captures full-page screenshots and a content snapshot (visible text, images,
// links, form placeholders) for every route, so a redesign can be verified to
// leave the site's content untouched.
//
// Usage: node design-audit/snapshot.mjs <baseUrl> <screenshotDir> <contentJsonPath>
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const [baseUrl = 'http://localhost:3100', shotDir, contentPath] = process.argv.slice(2);

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
  '/this-page-does-not-exist',
];

const WIDTHS = [390, 1440];

const norm = (s) => s.replace(/\s+/g, ' ').trim();

async function settle(page) {
  // Scroll through the page so every whileInView animation and count-up runs.
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      // 'instant' overrides the site's smooth scrolling so each step lands immediately.
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(2200);
}

async function extract(page) {
  return page.evaluate(() => {
    const norm = (s) => s.replace(/\s+/g, ' ').trim();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        n.parentElement && ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(n.parentElement.tagName)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT,
    });
    const text = [];
    while (walker.nextNode()) {
      const t = norm(walker.currentNode.nodeValue || '');
      if (t) text.push(t);
    }
    return {
      title: document.title,
      text,
      images: [...document.querySelectorAll('img')].map((i) => ({
        src: new URL(i.getAttribute('src') || '', location.href).pathname.startsWith('/_next/image')
          ? new URL(i.getAttribute('src'), location.href).searchParams.get('url')
          : i.getAttribute('src'),
        alt: i.getAttribute('alt'),
      })),
      links: [...document.querySelectorAll('a[href]')].map((a) => ({
        href: a.getAttribute('href'),
        text: norm(a.textContent || ''),
      })),
      placeholders: [...document.querySelectorAll('[placeholder]')].map((e) =>
        e.getAttribute('placeholder')
      ),
    };
  });
}

// CHROMIUM_PATH lets the script reuse a preinstalled browser instead of downloading one.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const content = {};

for (const width of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 844 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(baseUrl + route, { waitUntil: 'networkidle' });
    await settle(page);

    if (shotDir) {
      fs.mkdirSync(shotDir, { recursive: true });
      const name = (route === '/' ? 'home' : route.slice(1)) + `-${width}.png`;
      await page.screenshot({ path: path.join(shotDir, name), fullPage: true });
    }

    if (width === 1440) {
      const data = await extract(page);
      // FAQ answers only render once expanded — open every item and record them too.
      if (route === '/faq') {
        const buttons = page.locator('main button[aria-expanded]');
        for (let i = 0; i < (await buttons.count()); i++) await buttons.nth(i).click();
        await page.waitForTimeout(600);
        data.faqExpandedText = (await extract(page)).text;
      }
      content[route] = data;
    }
  }
  await context.close();
}

await browser.close();

if (contentPath) {
  fs.mkdirSync(path.dirname(contentPath), { recursive: true });
  fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
}
console.log('done', Object.keys(content).length, 'routes');
