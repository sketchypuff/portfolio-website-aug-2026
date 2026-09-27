# Design

A quiet, achromatic portfolio where the work and the writing carry the page.
Hierarchy comes from weight, size, and the one gray (`muted-foreground`), never
from color. The only hue on the site is `link` blue, and it means "this takes
you somewhere" — apart from `success` green, which only ever confirms an
action (the "Copied" tooltip).

`AGENTS.md` covers architecture. This file and `docs/design/` cover how the
site looks and why. Read the root rules below before any visual change, then
open only the topic file the task needs.

## Status

Two pages are **Decided**: home (`app/page.tsx`, Figma "Home", node
`1167:49`) and the blog post (`app/blog/[slug]/page.tsx`, Figma "Blog", node
`1132:2209`). The old inner pages, global header, and footer were deleted on
2026-09-27 to be rebuilt from scratch; don't look for them.

- **Building a new page** → build it from the Decided tokens and components in
  these docs. Where a page needs something the home page doesn't have (a page
  title, a back link, an article layout), that is a new design decision: take
  it from Figma or ask Yash, then record it here. Don't improvise one.
- **Provisional** — the prose elements the Figma frame doesn't show (`h3`,
  blockquote, code, tables, prose links, captions) and `full` image bleed.
- `/design` (`app/design/page.tsx`) is an unlisted style guide, not a page of
  the site.

## Hard rules

1. **Semantic tokens only.** Colors come from the tokens in
   [color.md](docs/design/color.md) (`text-muted-foreground`, `bg-muted`,
   `text-link`). Never a hex, `oklch()`, or Tailwind palette color
   (`text-neutral-500`, `bg-blue-600`). Raw values break dark mode.
2. **Blue is for links.** `text-link` goes on `TextLink` and the home nav's
   `ThemeTextToggle`, nothing else new. See [links.md](docs/design/links.md).
3. **Widths come from `<Container size>`.** `prose` | `default` | `wide` |
   `home`. Never hand-roll `max-w-*` on a page wrapper.
4. **Icons are Phosphor**, `*Icon` names, `/ssr` in Server Components. No
   custom SVGs.
5. **Nothing below 12px** (`text-xs`). **Nothing shifts on load** — every
   image has reserved dimensions and a blur placeholder.
6. **Motion uses the components in `components/motion/`** and every one of them
   renders statically under reduced motion.
7. **Reuse before you build.** Check [components.md](docs/design/components.md)
   first. A second implementation of an existing pattern is drift.

## Index

| File | Open it when |
| --- | --- |
| [color.md](docs/design/color.md) | picking any color, border, or opacity |
| [typography.md](docs/design/typography.md) | setting size, weight, font, or leading |
| [layout.md](docs/design/layout.md) | page width, spacing, radius, image bleed |
| [links.md](docs/design/links.md) | adding any link or clickable text |
| [components.md](docs/design/components.md) | building UI — lists every shared component |
| [motion.md](docs/design/motion.md) | anything that moves, hovers, or presses |
| [decisions.md](docs/design/decisions.md) | the dated log of what was decided and why |

## Keeping this current

These docs are updated in the same change as the code, never after.
`/design` (`app/design/page.tsx`) renders every token and shared component
from the real code — the visual counterpart to these files.

- A new shared component → add it to `components.md` with the four-part
  template (when to use / variants / correct + incorrect / flowchart if 3+
  options), and a specimen to `/design`. A new token → a swatch there too.
- A visual decision (from Figma or from Yash) → edit the topic file, mark it
  Decided, and add a dated line to `decisions.md`.
- A pending question below gets answered → move it to `decisions.md`.
- Every name in these docs must trace to a file. If the code changes a class,
  variant, or token, the doc changes with it.
- Root file stays under 100 lines, topic files under 150. Split by topic when
  one grows past that.

## Pending decisions

- **New pages.** About, blog index, projects index, case study, and 404 need
  designs. Until they exist, the home page's `/about` and `/blog` links go to
  Next's default 404, and the post back link goes to `/`.
- **Grays.** Every gray is the stock shadcn `neutral` preset, never compared
  with Figma. Swap in the Figma values (one file: `app/globals.css`) or
  confirm the defaults. See [color.md](docs/design/color.md).
- **Shared chrome.** Does every page carry its own nav and footer like home,
  or do inner pages get a shared header?
- **Date format.** Home shows `14 Aug 2025` (`formatDay`, `app/page.tsx`);
  the post page shows `15 Aug, 2026` (`formatDate`, `lib/content.ts`), both
  from Figma. Unify them, or confirm they differ on purpose.
- **External-link marker.** Home rows show no `↗`. Decide whether link-out
  cards or rows on new pages do.
- **Case study vs. blog post.** Same prose styles today; should they differ?
