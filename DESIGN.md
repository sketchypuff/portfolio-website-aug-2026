# Design

A quiet, achromatic portfolio where the work and the writing carry the page.
Hierarchy comes from weight, size, and the one gray (`muted-foreground`), never
from color. The only hue on the site is `link` blue, and it means "this takes
you somewhere".

`AGENTS.md` covers architecture. This file and `docs/design/` cover how the
site looks and why. Read the root rules below before any visual change, then
open only the topic file the task needs.

## Status: two languages, one of them decided

- **Decided** — the home page (`app/page.tsx`), built from the Figma "Home"
  frame (node `1167:49`), plus anything marked Decided in a topic file.
- **Provisional** — the inner pages (`/about`, `/blog`, `/projects`, their
  `[slug]` pages, `not-found`), the global header and footer, and prose
  styles. These are the shadcn scaffold, not a design anyone chose.

Inner pages get redesigned to the home language as Figma frames for them land.
Until then:

- Editing an inner page → reuse that page's existing patterns verbatim.
- Building a new inner page → copy the patterns of the closest existing inner
  page. Do not import home-page styling into it and do not invent a third.
- Never copy Provisional styling into the home page.

Mixing the two on one page produces a screen that belongs to neither system.

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

- A new shared component → add it to `components.md` with the four-part
  template (when to use / variants / correct + incorrect / flowchart if 3+
  options).
- A visual decision (from Figma or from Yash) → edit the topic file, flip the
  item from Provisional to Decided, and add a dated line to `decisions.md`.
- A pending question below gets answered → move it to `decisions.md`.
- Every name in these docs must trace to a file. If the code changes a class,
  variant, or token, the doc changes with it.
- Root file stays under 100 lines, topic files under 150. Split by topic when
  one grows past that.

## Pending decisions

- **Inner-page language.** Do inner pages adopt the home type (16px medium,
  mono uppercase labels, `SectionLabel`, `TextLink`)? Assumed yes, not yet
  designed.
- **Date format.** Home uses `14 Aug 2025` (`formatDay`, `app/page.tsx`);
  inner pages use `August 14, 2025` (`formatDate`, `lib/content.ts`). Pick one.
- **Dividers.** Home rows use a 0.5px `border-foreground/50` hairline; the blog
  index uses `divide-border`. Pick one.
- **Header and footer.** Provisional; do they get a Figma pass or does every
  page carry its own nav like home?
- **External-link marker.** `ProjectCard` shows `↗` on external links; home
  rows show nothing. Pick one rule for cards and rows site-wide.
- **Project with no cover image.** No treatment exists; the card renders
  text only.
- **Case study vs. blog post.** They currently share all styling.
