# AFAQ design upgrade: audit and plan

Scope: visual and UX only. Every word, image, link, route, section order, and behaviour stays
exactly as it is. `design-audit/snapshot.mjs` records the visible text, image `src`/`alt`, links,
and placeholders of every route before and after, and the two snapshots must match.

## Baseline (before any change)

| Check | Result |
| --- | --- |
| `npm run type-check` | passes |
| `next lint` | passes, 1 warning (`<img>` in hero) |
| `prettier --check` | **fails already**: 36 files not formatted |
| `jest` | **fails already**: no unit tests; `testMatch` picks up `e2e/main.spec.ts` (a Playwright file) |
| `playwright test` | **broken already**: `webServer` waits on port 3001 while `npm run dev` serves 3000; specs expect an English UI and an EN/AR toggle that the site no longer has |
| `npm run build` | passes |

## Problems found, ranked by impact

### Site-wide

1. **Arabic renders in a fallback system font.** `body` uses `font-sans` = Inter, which has no
   Arabic glyphs. IBM Plex Sans Arabic is loaded but only used in two spots. This single issue
   makes the whole site look unpolished.
2. **Letter-spacing and `uppercase` on Arabic text** (about 19 places: kickers, labels, dates,
   footer headings). Tracking pulls connected Arabic letters apart.
3. **Broken utility classes.** `h-13` (large buttons) does not exist in Tailwind 3, so primary
   CTAs collapse into thin bars. Opacity steps such as `/6`, `/8`, `/12` and `/4` aren't in the
   opacity scale, so those tints never render.
4. **Two palettes.** The brand tokens (cyan `#22D7FF`, blue `#0B78E7`) sit next to a separate
   `impact` palette (`#4f8ef7`, warm off-white `#f2f0ec`, a Fraunces serif) used only by the
   stats block, which looks like a different site. Committee cards alternate `#000033` and
   `#7F8292` in a checkerboard. The gallery uses purple, emerald, rose, and amber gradients.
   None of these come from the logo.
5. **RTL bugs.** The timelines on About and Join Us put their rail and dots on the physical left
   (`left-*`, `pl-*`) while the text runs right-to-left. FAQ buttons use `text-left`.
   Slide-in animations enter from the wrong side.
6. **Nested `<main>` landmarks.** The layout renders `<main>`, and every page renders another
   `<main>` inside it. There is also no skip link.
7. **Weak hierarchy.** Body copy is mostly 14px grey on black (hard to read in Arabic).
   Kickers are 11–12px. Card sizes and padding vary from page to page. There is no consistent
   section rhythm.
8. **Heavy effects.** Cyan glows on buttons and panels, `backdrop-blur` on static cards,
   infinite pulsing dots, and hover lifts on non-interactive boxes.
9. **Duplicate arrows.** Several strings already end in "←" (for example
   `عرض المعرض الكامل ←`) and the component adds an arrow icon as well.

### Page-specific

- **Home:** on phones the hero photo is cropped to 320px high with `object-cover`, which cuts
  people off at both sides. The royal quote is good in principle but reads as a generic boxed
  banner. The member avatars are flat grey placeholder discs.
- **Header:** the logo is 56–64px tall, which makes the bar heavy. There is no scrolled state.
  "Join" is a ghost button while "Contact" is outlined, so the primary action isn't the most
  prominent. The mobile menu has no focus trap, no Escape handling, and no scroll lock.
- **Footer:** the heading styles use Latin-style tracking, and the status dot pulses forever.
- **Events:** the CTA panel's hairline is `absolute` inside a non-positioned box, so it attaches
  to the wrong ancestor.
- **Contact:** small labels, 14px inputs, and input borders at about 1.3:1 contrast (WCAG needs
  3:1 for UI components).
- **About:** the Vision and Contact cards look identical to the Journey card, and all five
  blocks have the same visual weight.

## Design system

### Colour (dark theme; CSS variables in `app/globals.css`, exposed as Tailwind tokens)

| Token | Hex | Role | Contrast |
| --- | --- | --- | --- |
| `canvas` | `#07090D` | page background | — |
| `surface` | `#0D1118` | cards, alternate sections | — |
| `surface-raised` | `#131924` | hover, inputs on cards | — |
| `surface-overlay` | `#1A2130` | menus, popovers | — |
| `line` | `#1E2733` | hairlines, dividers | decorative |
| `line-strong` | `#2C3746` | card borders | decorative |
| `line-input` | `#5A6679` | form-control borders | 3.25:1 on surface |
| `ink` | `#E8EDF3` | headings, key text (soft off-white, not pure white) | 16.9:1 on canvas |
| `ink-secondary` | `#B7C1CD` | body paragraphs | 10.9:1 |
| `ink-muted` | `#8B97A6` | meta, captions | 6.7:1 (5.9:1 on raised) |
| `accent` | `#22D7FF` | primary CTA, links, active state (from logo) | 11.6:1 |
| `accent-strong` | `#0B78E7` | gradient end only (from logo) | decorative |
| `silver` | `#C9D0D9` | wordmark silver, used for secondary emphasis | 12.8:1 |
| `gold` | `#E3C27A` | royal attribution only | 10.1:1 on its tint |

Primary button: `canvas` text on `accent` (11.6:1). The cyan→blue gradient is reserved for the
hero headline and a few hairlines that echo the logo mark.

### Typography

- One family, **IBM Plex Sans Arabic** (Arabic and Latin subsets). Its Latin glyphs are IBM Plex
  Sans, so "AFAQ", email addresses, and numbers sit naturally inside Arabic lines. Inter,
  IBM Plex Sans, and Fraunces are dropped, so fewer font files are downloaded.
- Weights 400 / 500 / 600 / 700.
- Scale (fluid with `clamp`):

  | Step | Size |
  | --- | --- |
  | display | 40 → 60 |
  | title-1 | 32 → 44 |
  | title-2 | 26 → 32 |
  | title-3 | 19 → 21 |
  | lead | 17 → 19 |
  | body | 16 |
  | small | 14 |
  | caption | 13 |

- Line-heights: 1.85 for body, 1.3–1.4 for headings.
- Reading width capped at about 65ch.
- No tracking and no uppercase on Arabic. Latin-only kickers such as "AFAQ" get 0.16em.

### Space, shape, depth, motion

- 4/8-pt spacing.
- Container `max-w-[76rem]` with gutters of 20 / 32 px.
- Sections use `py-20 sm:py-28`.
- Page headers use `pt-16 sm:pt-24`.
- Radii: 10px for controls, 16px for cards, 24px for panels. Nothing larger.
- Shadows: two subtle dark elevations. No coloured glows except a single faint one on the
  primary CTA when hovered.
- Motion: one `Reveal` primitive (fade plus 12px rise, 450ms,
  `cubic-bezier(0.22, 1, 0.36, 1)`, triggered once when in view). Hover and press transitions
  run 150–250ms. `MotionConfig reducedMotion="user"` plus the CSS guard turn motion off for
  users who ask for reduced motion. No infinite animations.

### Components (`components/ui/`)

- `Button`: primary / secondary / ghost / link. Sizes sm / md / lg, with real heights of
  36 / 44 / 52px, so touch targets are at least 44px from md up.
- `Card`: surface, raised, and interactive variants. Only cards that act as links lift on hover.
- `SectionHeading` (kicker + title + description): used by the Home gallery section and the About
  page blocks. Its `h1` variant is the header on every inner page.
- `Container`.
- `Reveal` (the shared motion wrapper).
- `Badge`: fixed so it no longer applies `uppercase` to Arabic text.
- `.field` input style.

## Implementation order

1. Tokens: `tailwind.config.ts`, `app/globals.css`, fonts in `app/layout.tsx`.
2. Primitives in `components/ui/`, plus `Reveal` and `MotionConfig`.
3. Layout: skip link, a single `<main>`, header (scrolled state, accessible mobile sheet), footer.
4. Home (hero, stats, gallery), then About, Committees, Events, Projects, News, Gallery,
   Partners, Join Us, Contact, FAQ, Privacy, Terms, 404.
5. Verify: the content diff must be empty; review screenshots at 390 and 1440; re-run the checks.
