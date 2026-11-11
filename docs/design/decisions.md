# Decision log

Newest first. One line per decision: what, and why. Add a line in the same
change that makes the decision; move answered items out of "Pending decisions"
in `DESIGN.md` to here.

Dates before 2026-09-27 are backfilled from git history and earlier notes.

- **2026-11-11** — Selected work cards show `VIEW [ ]` only below `lg`
  (phones, tablets). On large screens the meta line is just the company and
  the cursor's "Open case study" label signals the card. From Yash.
- **2026-11-11** — `SiteFooter` uses the home v2 frame, placed as on
  emmiwu.com: clock under the sidebar, "Say hi" and "Page" on the card grid's
  second and third columns. It was still in
  the old 875px `Container`, inset from the full-bleed page. From Yash.
- **2026-11-11** — Home v2 (`home-v2` branch), after emmiwu.com: full-bleed
  sticky sidebar (intro, inline theme switch, Work/Writing/About bracket nav)
  beside stacked Selected work (11), Blog and Other work (8); card grids four
  across. Prototyped with a top name bar (removed: nav moved under the
  intro), a scroll-tracking section index (replaced by the page nav), and
  tabs (rejected: hid two of the three sections). `main` keeps the Figma
  home. From Yash.
- **2026-11-11** — No skeuomorphic buttons: the header keeps its text links
  and the bordered profession pill. Prototyped a glossy button (gradient body
  lifted toward white at the top, 1px inner top highlight, crisp darker ring,
  soft drop shadow, label text shadow; built from `foreground`/`background` so
  it inverts in dark mode) in three placements and kept the current header.
  Rejected: *Chip* (only the profession pill) — the loudest thing in the
  header; *Primary* ("Open resumé" as a 44px button) — reads as a sales CTA;
  *Everywhere* (pill, Resumé, About, theme as a button row) — loses the quiet,
  text-led tone and blue-means-link. From Yash.
- **2026-11-11** — The footer band inverts with the theme: dark on a light
  page, light on a dark one (`.inverted` in `globals.css`). It was dark in
  both, so in dark mode it barely separated from the page. From Yash.
- **2026-11-11** — Hovering a "Selected work" card labels the cursor "Open
  case study" (`WorkCard cursorText`). From Yash.
- **2026-11-11** — `CustomCursor` is link blue (`bg-link`, `text-link`), not
  foreground. From Yash. A second exception to blue-is-for-links, after the
  `ProfessionPill` icon.
- **2026-11-11** — `CustomCursor` replaces the system pointer on desktop,
  after rachelchen.tech: a sharp square that shrinks to 8px on links, turns
  into a caret over text, scales to 0.75 on press, and types a label
  (`data-cursor-text`) beside itself — "Read" on home writing rows. From Yash.
  Kept in `foreground` rather than her orange (blue stays link-only); her
  external-link preview cards were not ported.
- **2026-11-11** — The oneko pixel cat is removed from home, along with
  `components/oneko.tsx` and its sprite. From Yash. The entries below about
  the cat are history.
- **2026-11-11** — No serif: the site stays Geist Sans + Geist Mono.
  Prototyped Geist Serif (`geist@1.9.2`) on home in three placements and
  kept the current type. Rejected: *Headline* (greeting line only, 40px) —
  one serif moment reads as decoration; *Statement* (whole intro as a 32px
  serif paragraph, pill inline) — most voice, but eats the first screen on
  phones; *Editorial* (serif for headline, card and writing titles, 28/20/19px)
  — busiest, and long titles wrap. Constraints worth remembering: Geist Serif
  is a high-contrast display face with **one weight (400)** and no `wght`
  axis, so it can't do body text or a bold; its `ELSH` axis only swaps dot
  shapes (0 round, 25 square, 50 triangle, 100 heart). From Yash.
- **2026-11-11** — Home footer replaced with `SiteFooter`, after emmiwu.com:
  a full-bleed, always-dark band of mono uppercase columns (Noida clock, Say
  hi, Page). From Yash. "Last updated" and the footer section-label icons
  are gone. Dark comes from scoping the `.dark` tokens to the band, not new
  colours. Emmi's ASCII flower garden was deliberately not copied — it's her
  artwork.
- **2026-09-28** — Reading columns carry `selection-root`. WebKit fills
  selection gaps to the nearest clipped/transformed ancestor, which was the
  full-width `@container overflow-x-clip` wrapper, so highlighting a post
  painted edge to edge in Safari. An identity transform on `<article>` bounds
  it to the column; clipping would have cropped bleed figures.
- **2026-09-28** — The cat walks more and sits less: walks to a random spot
  at least 300px away (a random direction got cut short by edges), 1–3s
  rests, naps cut from ~19s to ~6s, a shorter alert pause before each walk. From Yash: it sat too long.
- **2026-09-28** — The cat strolls around on its own instead of chasing the
  cursor. From Yash. With no cursor to follow it now shows on touch devices
  too; reduced motion still hides it.
- **2026-09-28** — Stepper ticks get `cursor-pointer`: Tailwind v4 leaves
  buttons on the default arrow, and the ticks are small enough that the
  hand is the clearest sign they're clickable.
- **2026-09-28** — Hovering a "Selected work" card dims the other cards to
  50% (`WorkStrip dimOnHover`). Replaced a jamiepeak.co.uk-style "See more"
  cursor pill, tried the same day: dimming the rest points at the hovered
  card without covering it or hiding the cursor.
- **2026-09-27** — Bold text in post body (`strong`) is semibold (600), not
  bold. From Yash.
- **2026-09-27** — Post paragraphs and lists are regular (400), not the
  page's medium.
  From Yash.
- **2026-09-27** — Post title, subtitle, `h2`, and `h3` wrap normally, filling
  the column edge to edge, instead of `text-balance`/`text-pretty`. From Yash.
- **2026-09-27** — Post header scaled down from the Figma frame: title,
  summary, and meta all 24px (title and summary were 30/36px, meta 20px).
  Blockquotes set to body size (20/32). From Yash.
- **2026-09-27** — The cat uses onekocord's `silversky` skin instead of the
  default oneko sprite.
- **2026-09-27** — A oneko.js pixel cat chases the cursor on home. The one
  loud easter egg, kept to home, desktop pointers, and full motion. Ported to
  React rather than loaded as the original script, which leaks a
  body-level element and listeners across route changes.
- **2026-09-27** — Work strips get a tick stepper above them (after
  rithvika.work): one tick per card, a muted pill sliding to the current one,
  click to jump. Shows position and count, which the cut-off card alone
  didn't. Pressing a tick plays Cuelume's `tick`, the site's first sound,
  matching the reference. The stepper sits at the right end of the section
  heading's row rather than on its own line.
- **2026-09-27** — Scrolling a work strip ticks once per card it lands on,
  like a detent; the stepper press and the scroll share the one sound.
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
