# AFAQ Design Upgrade — Audit & Plan

## Methodology note
Two false leads were caught and corrected before this audit: (1) an initial
capture ran against a stale, long-lived dev server and rendered completely
unstyled — fixed by a clean restart; (2) `whileInView` framer-motion sections
appeared blank in early screenshots because nothing had scrolled them into
view yet, and `fullPage: true` screenshots visually clipped content under the
sticky header. The capture script (`design-audit/capture.mjs`) now scrolls
through the page first and resizes the viewport to the full document height
instead of using Playwright's stitching, avoiding both artifacts. This
matters because it means the site's baseline is **meaningfully more solid
than it first appeared** — this is a refinement pass on a reasonably healthy
foundation, not a rebuild.

## Findings, ranked by impact

1. **Arabic body text renders in the wrong font everywhere.** `body` uses
   `font-sans` → Inter (`app/globals.css:8`, `app/layout.tsx`), which has no
   Arabic glyphs, so nearly all Arabic text silently falls back to the OS
   default. `IBM Plex Sans Arabic` is already loaded as `--font-plex-arabic`
   but only opted into by 2 lines in `stats-impact.tsx`. This is the single
   highest-impact fix — it affects the look of every word on the site.

2. **`tracking-widest-*` / `uppercase` applied to Arabic text in 19 places**
   across 11 files (confirmed by grep, matches the brief exactly): kickers,
   badges, nav-adjacent labels. Connected Arabic script breaks visually under
   letterspacing and has no concept of case. Full list: `app/events/page.tsx`
   (×2), `app/about/page.tsx`, `app/join-us/page.tsx` (×2),
   `app/contact/page.tsx` (×2), `app/not-found.tsx`, `app/news/page.tsx`,
   `app/projects/page.tsx`, `app/partners/page.tsx`, `components/site-footer.tsx`
   (×3), `components/ui/badge.tsx` (×4), `components/ui/section-heading.tsx`.

3. **A second, disconnected color palette.** `impact-*` tokens
   (`#0b0c0e`, `#101215`, `#4f8ef7`, off-white text) live only in
   `stats-impact.tsx` and `committee-cards.tsx` and don't relate to the
   brand's cyan→blue gradient. Needs folding into the main token set.

4. **Elevation is done via borders + backdrop-blur, not tone steps.** Nearly
   every card is `border-white/[0.08-0.14] + bg-brand-9xx/NN + backdrop-blur`.
   Works, but is heavier than it needs to be and the brief specifically asks
   for a base/surface/raised/overlay tone scale instead.

5. **Mobile navigation has no dialog semantics.** `site-header.tsx`'s mobile
   menu is a plain `AnimatePresence` div: no focus trap, no Escape-to-close,
   no body-scroll lock, no `role="dialog"`/`aria-modal`. 10 nav items need a
   menu that behaves correctly for keyboard/screen-reader users.

6. **One non-logical directional property.** `.nav-link::after` in
   `globals.css` is anchored with `left: 0`, so the active/hover underline
   grows from the physical left — the logical *end* in this RTL site, not the
   *start*. Every other layout already uses `ms-/me-`/`text-right` correctly;
   this is the one leftover.

7. **Committees page cards alternate two unrelated flat colors** (navy
   `#000033` / gray `#7F8292`, set directly in `app/committees/page.tsx`'s
   `BOX_STYLES`) that don't derive from the brand gradient and compete with
   it. Candidate for the "fold into one token system" pass.

8. **Card/button primitives are already in reasonable shape** (cva-based,
   sensible size scale, `focus-visible` rings present). This is a genuine
   strength to build on, not a redo.

9. Minor: `<img>` (not `next/image`) in `section-hero.tsx` for the hero photo
   — lint already flags this (`no-img-element`); switching to `next/image`
   with `priority` and correct `sizes` is straightforward and content-safe
   (same `src`/`alt`).

## Proposed token system

**Color** (all derived from the existing logo gradient `#22D7FF → #0B78E7` +
brand ink; the `impact` palette is retired and merged in):

| Token | Hex | Use |
|---|---|---|
| `bg.base` | `#08090C` | page background (was `#050505`, slightly lifted so surfaces can read against it) |
| `bg.surface` | `#0F1116` | section-level panels |
| `bg.raised` | `#171A21` | cards |
| `bg.overlay` | `#1E222B` | modals, mobile menu sheet, popovers |
| `text.primary` | `#EDEFF2` | headings — soft off-white, not `#fff` |
| `text.secondary` | `#A9B0BD` | body copy — checked at 4.5:1 against `bg.base`/`bg.surface` |
| `text.muted` | `#7A8291` | captions — checked at 3:1 (large text / UI only) |
| `accent.DEFAULT` | `#22D7FF` | primary CTA, links, active state |
| `accent.strong` | `#0B78E7` | gradient partner / pressed state |
| `silver` | `#C3D0E1` | wordmark-echo accents (sparingly) |

Existing `brand-*`/`accent-*` scale is kept (widely referenced), extended
with the `bg.*` elevation aliases above; `impact-*` tokens are deleted and
their 2 consumers repointed at the shared scale.

**Type** (IBM Plex Sans Arabic primary via `font-sans`, Inter kept for pure
Latin runs where already used e.g. "AFAQ" wordmark/emails):
`display` 44/56px, `h1` 36/44, `h2` 28/36, `h3` 22/30, `h4` 18/26,
`body-lg` 17/30 (1.76), `body` 15/26 (1.73), `small` 13/22, `caption` 12/20.
No `tracking-*`/`uppercase` on any Arabic-bearing element.

**Spacing/radius/shadow**: keep the existing 4px-based Tailwind scale and the
existing `rounded-2xl/3xl/4xl` + `shadow-glow/card/soft` sets — they're
already close to "one scale applied consistently"; the fix is usage
discipline (e.g. committees page opting out with literal hex), not new
tokens.

## Implementation order

1. Tokens: `tailwind.config.ts` (retire `impact-*`, add elevation aliases,
   set `font-sans` → Plex Arabic stack), `app/globals.css` (root font-family,
   fix `.nav-link::after` to `inset-inline-start`).
2. Primitives: `components/ui/badge.tsx` (drop uppercase/tracking on Arabic
   label paths), `components/ui/section-heading.tsx` (same), `Card`/`Button`
   token cleanup only (no structural change — they're sound).
3. Header/footer: mobile menu → proper dialog (focus trap, Escape, scroll
   lock, `aria-modal`), skip-to-content link in `app/layout.tsx`.
4. Homepage, then remaining pages: apply the same token/typography fixes;
   rebuild `committees` page's card colors onto the shared scale.
5. `section-hero.tsx`: `<img>` → `next/image`.

## Explicitly out of scope for this pass (per hard constraints)
No copy, ordering, or structural changes; the retired `impact-*` tokens are a
visual-only rename/redirect (same computed appearance on the 2 consumer
components, not a redesign of `stats-impact.tsx`/`committee-cards.tsx`
layout).
