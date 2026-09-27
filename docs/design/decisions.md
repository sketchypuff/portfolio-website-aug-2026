# Decision log

Newest first. One line per decision: what, and why. Add a line in the same
change that makes the decision; move answered items out of "Pending decisions"
in `DESIGN.md` to here.

Dates before 2026-09-27 are backfilled from git history and earlier notes.

- **2026-09-27** — Work strips get a tick stepper above them (after
  rithvika.work): one tick per card, a muted pill sliding to the current one,
  click to jump. Shows position and count, which the cut-off card alone
  didn't. Pressing a tick plays Cuelume's `tick`, the site's first sound,
  matching the reference.
- **2026-09-27** — Home "Email" copies the address instead of opening a
  mail app: hover shows "Click to copy", then the same tooltip morphs into a
  green "✓ Copied". Adds `success` green, the second hue, for confirmation
  only. First shadcn primitive installed (`tooltip`).
- **2026-09-27** — Two quiet easter eggs on home, both found rather than
  performed: the profession pill says "that’s all of me" once after a full
  lap, and the Noida clock adds a muted line guessing what Yash is doing at
  that hour. No colour, nothing on load.
- **2026-09-27** — Figure and Gallery captions are centered, balanced so
  multi-line captions don't leave a lone word.
- **2026-09-27** — First real post imported from Medium
  (`storytelling-in-ux-case-studies`); its home Writing row is now a linked
  row and shows the real publish date. Lists follow the Figma frame (all
  numbered) rather than Medium's bullets; the Medium outro (clap, self-plug,
  "See you later" and newsletter links) is dropped.
- **2026-09-27** — Post page `/blog/[slug]` built from the Figma "Blog" frame
  (`1132:2209`): 700px `article` column, 1323px `articleWide` row and `wide`
  images, 20/32 body, 24px bold `h2`, 80px between blocks, `rounded-xl`
  figures. New `IconCircle` and `PostNav`. Arrows are Phosphor.
- **2026-09-27** — Post body and metadata use `foreground`, the subtitle
  `muted-foreground` (Figma: black 80% / 40%). Keeps two text levels.
- **2026-09-27** — Ordered-list numbers are mono and muted, not the Figma
  link blue. Blue stays link-only.
- **2026-09-27** — The post back link scrolls with the page and goes to `/`
  until `/blog` exists. Both Figma circle fills (`#e6e6e6`, `#f2f2f2`) map
  to `bg-muted` pending the gray decision.
- **2026-09-27** — Post date format `15 Aug, 2026` (`formatDate`, from Figma).
  Reading time is computed at ~200 wpm, not written in frontmatter. Older
  post on the left of `PostNav`, newer on the right.
- **2026-09-27** — Dark `--link` snapped to `--blue-300` (was
  `oklch(0.72 0.15 262)`, off the scale). Both link colors now come from one
  scale; contrast on the dark background rises from 7.9:1 to 8.5:1.
- **2026-09-27** — Blue scale `--blue-50…950` built from the link blue (600
  = `#2148f9`): fixed hue, even lightness, gamut-safe chroma. Primitives only,
  outside `@theme`; light `--link` now points at `--blue-600` (same value).
- **2026-09-27** — Color doc records where every color comes from (shadcn
  `neutral` preset vs. Figma `link` vs. Tailwind's `shadow-xs` default) and a
  per-file usage map. The grays are marked Default, not Decided.
- **2026-09-27** — Inner pages removed to be rebuilt from scratch: /about,
  /blog, /blog/[slug], /projects, /projects/[slug], the custom 404, the
  global header and footer (and `HideOnHome`, the icon `ThemeToggle`,
  `site.nav`), `PostLink`, and `ProjectCard`. The content pipeline (MDX,
  `Figure`/`Gallery`, `lib/content.ts`, `content/`) stays. New pages are built
  from the home system; the old scaffold is no longer a pattern to copy.
- **2026-09-27** — `/design` style guide: every token and shared component
  rendered from real code, unlisted and noindex. `WorkStrip`/`WorkCard`
  moved to `components/work-strip.tsx` so it can render them.
- **2026-09-27** — Home nav gets a text theme switch (`ThemeTextToggle`) in
  link blue: a button, but it shares the blue so the nav reads as one set of
  controls. (`0f6674a`)
- **2026-09-27** — `RevealGroup` / `RevealItem` take `as`; every animated
  list (home strips and writing rows, /blog, /projects) is now `ul` > `li` so
  screen readers announce it as a list. Every bullet-less list also gets
  `role="list"` (automatic in `RevealGroup`) for Safari.
- **2026-09-27** — Docs patched after two agent test runs (a /now page, a
  home "Side projects" section): page width chosen by content shape, link
  tree covers list titles and linked rows, row focus-ring inset, inner-page
  section spacing, `ArrowUpRightIcon` as the `TextLink` default. A /uses re-test then
  drove: linked-row spacing from `PostLink`, inner-page external marker
  from `ProjectCard`, page-local data stays inline.
- **2026-09-27** — Design docs split into `DESIGN.md` + `docs/design/`, with
  every rule marked Decided or Provisional. `TextLink` and `SectionLabel`
  moved out of `app/page.tsx` into `components/` so other pages can reuse
  them instead of rebuilding them.
- **Profession pill cycles on click** — five professions, blur-morph swap,
  spring width. Nothing plays on load. (`e044b33`)
- **Phosphor is the only icon set** — matches Figma; weights cover functional
  and expressive icons without mixing styles. The Figma pixel-art section
  icons were replaced to keep one set. (`a8fc186`)
- **Resumé is a Drive PDF, not a page** — every link opens it in a new tab.
  Work strips bleed off both viewport edges. (`ac2f149`)
- **One accent, for links only** — `--link` (`#2148f9`, lighter in dark mode)
  so blue reliably means "this takes you somewhere".
- **Home page from Figma "Home" frame (`1167:49`)** — 875px column, no global
  header/footer on `/`, mono uppercase section labels with 24px icons.
- **Enter-only route transitions** — exiting pages hold stale content and read
  as lag.
- **Reveal defaults: 12px, 500ms, house curve, once** — louder reads as
  decoration.
- **No layout shift from images** — bundler-loaded content images with
  intrinsic size and blur placeholder. A hard requirement: a minimal layout
  has no noise to hide a shift behind.
