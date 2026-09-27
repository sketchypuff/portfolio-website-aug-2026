# Design

Design principles and system for yashshenai.com.

This document is the source of truth for visual decisions. `AGENTS.md` covers
architecture and code conventions; this covers how the site should look and
feel, and — more importantly — *why*.

**Status: mostly unwritten.** The sections below are deliberately empty,
waiting on real designs. What is filled in is only what already exists in the
code, and all of it is provisional scaffolding, not a decision anyone made on
purpose. Overwrite it freely.

A note on how to use this file: record the *reasoning*, not just the value.
"Body text is 16px" ages badly and tells a future reader nothing. "Body text is
16px because the line length at this measure lands around 70 characters"
survives, and lets someone judge whether a change breaks the intent.

---

## Principles

_To be written._

Three to five statements about what this site is for and what it refuses to do.
Written as opinions that can be disagreed with — a principle that nobody could
argue against is not doing any work.

The one thing established so far, from the brief: **the content and imagery are
the hero.** The design's job is to get out of the way of the work.

---

## Typography

_To be written._

Needs: type scale and the reasoning behind its ratio, line lengths, line
heights, weights in use and what each one signals, how headings relate to body
copy, how captions and metadata differ from prose.

**Currently in the code (provisional):**

- Geist Sans for everything, Geist Mono for dates and metadata. This came from
  the shadcn preset, not from a decision.
- Headings are `font-medium` with `tracking-tight`. Body is default weight at
  `leading-[1.75]`.
- Prose measure is capped by `Container size="prose"` (`max-w-2xl`).
- Prose element styles live in the `prose` map in
  `components/content/mdx.tsx` — that map is where the type scale should be
  tuned.

---

## Color

_To be written._

Needs: whether the site stays achromatic or takes an accent, what that accent
would be reserved for, how light and dark differ beyond inversion, and what
carries hierarchy in the absence of color.

**Currently in the code (provisional):**

- A pure-neutral OKLCH ramp from the shadcn `neutral` base, defined in
  `app/globals.css`. Zero chroma throughout — no accent color anywhere.
- Light and dark are both defined; dark is not a simple inversion of light.
- **Decided: one accent, for links only.** `--link` (`text-link`) is the
  Figma blue `#2148f9`, with a lighter value in dark mode so it holds contrast.
  It is reserved for navigational links ("Open resumé", "About", "Open blog")
  so that blue reliably means "this takes you somewhere". Everything else
  stays achromatic.
- Always use the semantic tokens (`bg-background`, `text-muted-foreground`,
  `border-border`), never a raw hex or OKLCH value. This is what keeps the two
  themes in sync.

---

## Space and layout

_To be written._

Needs: the spacing scale and its rhythm, how vertical rhythm is maintained
between sections, how the grid behaves at each breakpoint, when images are
allowed to break the text column.

**Currently in the code (provisional):**

- Three container widths, from `components/container.tsx`: `prose`
  (`max-w-2xl`), `default` (`max-w-3xl`), `wide` (`max-w-5xl`). Page wrappers
  should use these rather than hand-rolled `max-w-*`.
- Images can break out of the prose column via `<Figure bleed="wide">` or
  `bleed="full"`. The bleed values in `components/content/figure.tsx` are
  paired with `sizes` attributes — changing one without the other makes the
  browser download the wrong image.

**Home page (from the Figma "Home" frame, node `1167:49`):**

- One 875px column (`Container size="home"`), sections 80px apart, section
  label 32px above its content.
- No global header or footer on `/`. The intro's links are the nav, and the
  Contact / Last updated / Currently row is the footer. Inner pages keep the
  global chrome.
- Section labels are Geist Mono semibold, uppercase, with a 24px Phosphor
  icon beside them, the same set and weight as every other icon on the site.
- Work is shown as horizontal strips of 570px cards that bleed off the right
  edge of the viewport. The cut-off card is the affordance that the row scrolls.

---

## Motion

_Partially decided._ The brief called for tasteful polish: alive, but the
content stays the star.

**Established:**

- House defaults: 12px of travel, 500ms, `cubic-bezier(0.22, 1, 0.36, 1)`,
  triggered once. Anything louder reads as decoration on a minimal layout.
- Route transitions are enter-only. Animating the outgoing page holds stale
  content on screen and reads as lag rather than polish.
- Every motion component must early-return a static version under
  `prefers-reduced-motion`. This is non-negotiable, not a nicety.
- Vocabulary lives in `components/motion/`: `Reveal`, `RevealGroup` /
  `RevealItem`, `PageTransition`.

- **Profession pill** (`components/profession-pill.tsx`, Figma component set
  `1137:2706`): the intro's "product designer" pill cycles through five
  professions on click. It is interactive UI rather than a reveal, so it runs
  faster than the house defaults: the label swaps with 10px of vertical travel
  and a 4px blur (enter 300ms on the house curve, exit 180ms ease-in, so the
  exit gets out of the way). The width follows on a zero-bounce spring because
  people click it repeatedly and a spring retargets mid-resize without a
  jolt. Press feedback is `scale(0.96)`. Nothing plays on page load.

**Still open:** hover behavior as a system rather than per-component
improvisation; whether images get a distinct entrance from text; whether
anything on the site earns a signature moment.

---

## Imagery

_To be written._

Needs: aspect ratio conventions, when an image gets a caption, how galleries
are grouped, whether screenshots get frames or shadows, how project covers
differ from in-body images, and what the treatment is for images that must work
on both light and dark backgrounds.

**Currently in the code (provisional):**

- Project cards use a 4:3 crop.
- Everything gets a blur-up placeholder and reserved dimensions, so nothing
  reflows on load. This is a hard requirement, not a style choice — on a
  minimal layout there is no visual noise to hide a shift behind.
- Card images scale to 1.02 on hover over 500ms.

---

## Components

_To be written._

Document components as they earn a place: what each is for, when *not* to use
it, and the states it must handle.

### Icons

- Phosphor (`@phosphor-icons/react`) is the one icon library, and shadcn's
  `iconLibrary` points at it. It matches the Figma file, and its weights
  (regular for UI, duotone/fill for moments of character) cover both
  functional and expressive icons without mixing styles.
- Import the `*Icon` names (`ArrowLeftIcon`); the bare names are deprecated.
  Server Components import from `@phosphor-icons/react/ssr`.
- No custom icon artwork. The pixel-art section icons from the Figma file were
  replaced with Phosphor equivalents so the whole site uses one set.

---

## Accessibility

_To be written._

Needs: contrast targets, focus treatment, how motion preferences are honored
across the site, alt text conventions for a portfolio where images carry the
argument.

**Currently in the code (provisional):**

- Focus rings via `focus-visible:ring-ring`.
- `prefers-reduced-motion` honored in every motion component.
- Alt text is authored per image in MDX. Decorative images pass an empty
  string deliberately.

---

## Open questions

Things to resolve as the design lands:

- Does the site take an accent color, or stay fully achromatic?
- How much does a project case study differ from a blog post visually? Right
  now they share almost all styling.
- Is there a signature moment anywhere, or is restraint the whole point?
- What is the treatment for a project with no cover image?
