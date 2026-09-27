# Decision log

Newest first. One line per decision: what, and why. Add a line in the same
change that makes the decision; move answered items out of "Pending decisions"
in `DESIGN.md` to here.

Dates before 2026-09-27 are backfilled from git history and earlier notes.

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
