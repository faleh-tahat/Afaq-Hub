# AFAQ design upgrade: report

This is a visual and UX redesign of every page. Every word, image, link, route, section order,
and behaviour is unchanged. See `PLAN.md` for the audit that drove it.

## 1. Proof that content is unchanged

`design-audit/snapshot.mjs` visits all 14 routes (including the 404 page and the FAQ with every
answer expanded). For each one it records:

- all visible text nodes, in DOM order;
- every image's `src` and `alt`;
- every link's `href` and text;
- every form placeholder;
- the document title.

`content-before.json` was captured on the original site and `content-after.json` on the
redesign. **The diff between them is empty.** To reproduce:

```bash
npm run build && npx next start -p 3100 &
node design-audit/snapshot.mjs http://localhost:3100 /tmp/shots design-audit/content-after.json
diff <(python3 -m json.tool design-audit/content-before.json) \
     <(python3 -m json.tool design-audit/content-after.json)   # prints nothing
```

Set `CHROMIUM_PATH=/path/to/chrome` to reuse an installed Chromium instead of downloading one.
The same script writes full-page screenshots at 390px and 1440px. They are not committed
because they add about 12 MB per run.

## 2. Design system

- **Colour.** CSS-variable tokens in `app/globals.css`, exposed as Tailwind colours, so opacity
  modifiers work.
  - Surfaces: near-black canvas `#07090D` → surface → raised → overlay.
  - Text: three tiers, `ink` at 16.9:1, `ink-secondary` at 10.9:1, and `ink-muted` at 6.7:1
    contrast. All pass WCAG AA; body copy is a soft off-white, not pure white.
  - Accent: exactly the logo's cyan `#22D7FF` and blue `#0B78E7`.
  - Gold is reserved for the royal attribution.
  - Removed: the separate `impact` palette, the navy/grey committee colours, and the
    purple/emerald/rose gallery gradients.
- **Typography.**
  - IBM Plex Sans Arabic (Arabic and Latin subsets) for the whole site. Inter, IBM Plex Sans, and
    Fraunces are no longer loaded, so fewer font files are downloaded.
  - Fluid scale: `display`, `title-1…3`, `lead`, `body`, `small`, `caption`.
  - Line-height 1.85 for body text and 1.3–1.55 for headings.
  - No letter-spacing or uppercase on Arabic. Only Latin-only kickers ("AFAQ") are tracked.
- **Shape and depth.**
  - 4/8-pt spacing.
  - A 76rem container with 20/32px gutters.
  - Radii: 10px for controls, 16px for cards, 24px for panels.
  - Two dark elevation shadows. The only coloured glow is on primary-button hover.
- **Motion.**
  - A single `Reveal` primitive: fade plus 12px rise, 450ms, played once when in view.
  - `MotionConfig reducedMotion="user"` plus a CSS guard for visitors who ask for reduced motion.
  - No infinite animations.
- **Texture.** A circuit-trace pattern (`.bg-circuit`) drawn from the logo mark. It is used
  sparingly: gallery cards, committee cards, partners, and the 404 page.
- **Components** (`components/ui/`):
  - `Button`: primary / secondary / ghost / link; 36 / 44 / 52px heights. The old `h-13`
    class didn't exist, which collapsed large buttons.
  - `Card`, `Badge`, `SectionHeading` (with an `as="h1"` option) and `SectionKicker`,
    `PageHeader`, `Container`, `Reveal`, and `.field` form controls.
  - `lib/utils.ts` now tells tailwind-merge about the custom scales. Otherwise `cn()` would drop
    classes such as `text-canvas` when combined with `text-small`.

## 3. What changed, page by page

- **Layout.**
  - There is now a single `<main>` landmark; pages used to nest a second one.
  - Every page now has exactly one `h1`. Inner pages previously had none.
- **Header.**
  - The logo is sized for a lighter 64/72px bar, and the bar gains a border and backdrop once the
    page scrolls.
  - The active link gets an underline and `aria-current`.
  - "انضم إلينا" is now the primary button.
  - The mobile menu is a full-screen sheet: focus stays inside it, Escape closes it and returns
    focus to the toggle, it closes on route change, and page scroll is locked while it is open.
- **Footer.**
  - Clear column hierarchy, with the Explore links in two columns.
  - A logo-gradient hairline along the top.
  - The status dot is static instead of pulsing forever.
- **Home.**
  - The team photo shows at its natural ratio, so no one is cropped on phones.
  - The King's quote overlaps the photo in a dignified panel with a gold rule and gold
    attribution, and it is still the first thing after the photo.
  - The headline is one line on desktop, set in the logo gradient.
  - The stats use brand tokens: a 2×2 grid on phones and a single row on desktop.
  - Gallery cards use brand-only tints plus the circuit texture.
- **About.**
  - The intro gets the page glow, and the motto gets an accent rule.
  - The timeline is horizontal on desktop. On mobile it is vertical, with its line correctly on
    the start (right) side.
  - "كن جزءًا من آفاق" is the featured panel.
  - Vision and Contact sit side by side on desktop.
- **Committees.** A uniform card system with accent icon tiles, replacing the navy/grey
  checkerboard.
- **Events, Projects, News.**
  - Consistent cards and a clear meta line (date, location, category).
  - Duplicate arrow icons removed where the label already ends in "←".
  - Fixed the Events CTA hairline, which was positioned against the wrong ancestor.
- **Partners.** Even tiles with a faint texture.
- **Join Us.**
  - The roles list sits next to a sticky "application process" panel.
  - The step rail is now RTL-correct.
- **Contact.**
  - 48px inputs with 3.25:1 borders and a visible focus ring.
  - Labels at 14px.
  - Added `name` and `autocomplete` attributes.
  - The send icon is mirrored for RTL.
- **FAQ.**
  - The accordion has `aria-controls` and a `region` role, start-aligned questions, and a larger
    hit area.
- **Privacy, Terms.** One shared, readable document layout.
- **404.** Page glow, texture, and a clear pair of actions.

## 4. Checks

| Check | Before | After |
| --- | --- | --- |
| `tsc --noEmit` | pass | pass |
| `next lint` | 1 warning (`<img>`) | **no warnings** (hero uses `next/image`) |
| `next build` | pass | pass |
| `prettier --check` | 36 files failing | 11 failing: all files this work didn't touch (`lib/i18n.ts`, `middleware.ts`, test configs, etc.) |
| `jest` | fails: no unit tests; `testMatch` picks up the Playwright spec | unchanged (tests not edited) |
| `playwright test` | broken: `webServer` waits on :3001 but dev serves :3000; specs expect an English UI and EN/AR toggle | unchanged (tests not edited) |
| Horizontal overflow at 360/390/768/1024/1280/1440 | n/a | none on any route |
| One `h1` and one `<main>` per page, all images with `alt`, no unnamed controls | failed | pass on all 14 routes |

## 5. Proposals not implemented

Each of these would change content, structure, or behaviour, so they are left for the owners
to decide.

1. **Skip-to-content link.** This needs a new visible string, for example
   «تخطَّ إلى المحتوى».
2. **Real photos in the gallery.** The gallery cards have no photos. `public/` already holds
   unused team photos (`afaq-center.jpeg`, `last-PERLEMAN.jpeg`, `afaq-team.jpg`). Putting them
   in the gallery would be a content decision. Also, `afaq-team.png` is 15.7 MB and `afaq-team.jpg`
   is 3.8 MB, so compress them before using them anywhere.
3. **Two different "join" destinations.** The header's «انضم إلينا» goes to `/about#join`, while
   the hero and footer go to `/join-us`. Pick one.
4. **Dead "ابدأ طلبك" button.** On `/join-us` it does nothing. It could open the Google Form
   already linked on About.
5. **Simulated contact form.** The form only pretends to submit; nothing is sent.
6. **FAQ missing from desktop.** The desktop header shows 7 of the 10 nav items, so FAQ is only
   reachable from the mobile menu. Consider adding it to the footer.
7. **Hard refresh jumps home.** The reload-redirect script sends any refresh on an inner page to
   the homepage. Visitors lose their place.
8. **Missing assets.** `og-image.jpg` and `favicon.ico` are referenced in `app/layout.tsx` but
   don't exist in `public/`.
9. **Copy consistency.**
   - Two contact emails: `afaqteam12@gmail.com` (About) and `@afaq-team.org` (Contact).
   - Two domains: `afaq-team.com` in the config and `.org` in the copy.
   - Mixed naming: "AFAQ Technology", "AFAQ Tech Team", «فريق آفاق التكنولوجيا».
   - Events, projects, and news read like placeholders (for example, a summit in Cairo).
   - Arrows ("←") are baked into several strings, which is better handled with icons.
   - The "140+" in the hero member line is hard-coded rather than taken from the stats.
10. **Theme colour.** `themeColor` in the viewport metadata is still `#050505`. It could match
    the new canvas `#07090D`; it was left alone because metadata was out of scope.
11. **Committee colours.** If the navy (`#000033`) and grey (`#7F8292`) committee colours were a
    deliberate brand choice, they can come back as tokens.
