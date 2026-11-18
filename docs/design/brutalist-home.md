# Brutalist home

**Provisional.** The live design on `main` (it replaced the Figma home on
2026-11-18; that one is on the `figma-home` branch). The home page
(`app/page.tsx`) is rebuilt to match the layout of the Plyń Framer portfolio template
(plyn-chacviorty.framer.website), measured from the live page on
2026-11-18. The copy is Yash's own; none of the template's text or photos are used.
Case studies, blog posts, and `/about` use the same style; see their sections below.

## Tokens

Two monochrome palettes that follow the site theme (next-themes' `.dark` on
`<html>`, default `system`), scoped in `app/globals.css` to `.brutalist`
(and `:root:has(.brutalist)`, so the body matches). Components use only the
semantic classes, so every brutalist page gets both.

| Token | Light | Dark |
| --- | --- | --- |
| `background` | #f0f0f0 (`oklch(0.9551 0 0)`) | #121212 (`oklch(0.1822 0 0)`) |
| `foreground` | #121212 | #f0f0f0 |
| `muted-foreground` | #121212 at 50% | #f4f4f4 at 50% |
| `border` | #121212 at 10% | #f4f4f4 at 10% |
| `muted` (image placeholders) | `oklch(0.9 0 0)` | #1e1e1e |

Light was added on 2026-11-18 as the dark palette inverted. `SquareCursor`
and its label stay white in `mix-blend-exclusion`, so they read as dark on
the light page.

## Type

Geist (`font-sans`, the site font from `app/layout.tsx`), 14px / 20px,
weight 400, for everything. Hierarchy is only `foreground` vs
`muted-foreground`. The reference uses Manrope; Geist was chosen over it on
2026-11-18 (see `decisions.md`).

## Layout

All spacing is the template's 14px unit.

| Width | Layout |
| --- | --- |
| ≥1200px | Sticky 360px sidebar (`h-dvh`, 14px padding), 3-column grid from x=374, 14px column gap |
| 810–1199px | Intro on top (`min-h-[565px]`, text max 560px), "Selected Works / Updated" rule, 2-column grid |
| <810px | Same, 1 column |

- Intro: sun toggle + `h1` (a row ≥1200, stacked below), paragraphs 7px
  apart ("oh yeah!" is an `<em className="oh-yeah">`: italic, filled with a
  looping blue OKLCH gradient (hues 225 → 266 → 285 → 245), 4s linear, one
  lightness per theme, static under reduced motion; defined in
  `app/globals.css`. The only color on home besides images), then two link groups, 14px between groups. Each group has a muted
  heading with its underlined links 7px below, 4px apart:
  - **Table of Contents** (`nav`): Blog (jumps to `#blog`, the home Blog
    list, until a /blog index exists), About, Resumé (new tab).
  - **Socials:** LinkedIn, GitHub (new tab), then the email as `CopyEmail`.
- Cards: image, then title 7px below, `muted-foreground` subtitle; 28px between rows.
  Image ratios cycle 4:5, 1:1, 4:3, 1:1 (`ASPECTS`).
- **Blog**, then **More Work**, follow the card grid, 56px apart, at every
  width. Each has a header like Selected Works' (muted label left, count
  right, 1px rule).
  - Blog: every post from `getPosts()`, newest first, as 14/20 rows (title
    left, date right as `20 Jul 2025` (`formatShortDate`, like `UPDATED`), 7px vertical padding, 1px
    rule under each). Rows link to the post, carry `data-cursor-text="Read"`,
    and dim like the cards.
  - More Work: the same grid as Selected Works (1 / 2 / 3 columns, 14px
    column gap, 28px row gap), 13px below its header. Each card is the
    image at its own aspect ratio, then "Company, Year" 7px below and the
    title in `muted-foreground`. Not linked, so no hover state and no
    cursor label: nothing dims, unlike the cards. A page-local
    array: the "Extras" list and images from the Framer "Yash's Portfolio
    v2" home. Images are static imports from `assets/more-work/` (intrinsic
    size and blur placeholder), not `public/`.
  - Below 1200px the column ends with 34px extra so the fixed copyright
    doesn't cover the last card.
- Copyright is `fixed` 14px from the bottom: left ≥1200, right below.

## Behaviour

- **Hover dim** — hovering a card (or a Blog row) drops every other one in
  its list to 50% opacity,
  300ms (`group-has-[li:hover]/grid`). CSS only.
- **`ThemeSunToggle`** (`components/brutalist/theme-sun-toggle.tsx`) — the
  icon beside the name switches light / dark (`setTheme`). It shows the
  theme it switches to: a sun in dark mode, a moon in light. Icons and the
  screen-reader label swap with the `dark:` variant, so there's no
  hydration flash. Replaced `MonoToggle` (a grayscale switch for the work
  images) on 2026-11-18.
- **Route transition** — to and from home, four strips (one per grid
  column) wipe over the change: `ColumnsTransition`, see `motion.md`.
- **`ClickSound`** — cuelume `press` on every link, button, and lightbox
  image (`toggle` on the theme toggle). See `motion.md`, "Sound".
- **`SquareCursor`** (`components/brutalist/square-cursor.tsx`) — a sharp
  white square in `mix-blend-exclusion`, after the `braun` branch's
  `CustomCursor` but monochrome: 14px resting, 8px over anything clickable
  (120ms), 0.75 while pressed, locked to the pointer (no trail). Replaced a
  trailing 32px white dot (`DotCursor`) on 2026-11-18. Replaces
  `CustomCursor`, which bows out on `/`, `/about`, `/projects/*` and
  `/blog/*`. Fine pointers
  >768px only; none under reduced motion.
  Over an element with `data-cursor-text`, the label (Geist 14/20, white,
  same blend) types out 7px right of the square over at most 160ms and
  deletes itself on the way out. Each work card's link carries
  `data-cursor-text="View case study"`.
- **`Grain`** (`components/brutalist/grain.tsx`) — fixed canvas of random
  gray noise at 15% `soft-light`, redrawn every 80ms; static under reduced
  motion.
- Email uses `CopyEmail variant="brutalist"` with the address as its
  label: a square light Geist 14/20 tooltip, no arrow, monochrome when
  copied (see `components.md`).

## Case study (`app/projects/[slug]/page.tsx`)

After the template's project page (plyn-piaty.framer.website/void-ai), less
its white frame and its Close / Prev / Next bar, which Yash left out. Same
tokens, type, `Grain`, and `SquareCursor` as home.

- **≥1200px:** four equal columns. Column 1 is a sticky `h-dvh` sidebar
  (14px padding): a Back link to home (Phosphor `ArrowLeft` at 14px, 7px
  gap, underlined label, like home's links), title, `summary` in `muted-foreground`, intro paragraphs
  (8px apart), then the details list (Client / Agency / Role / Year, muted,
  from frontmatter, empty ones skipped), 14px between groups; the section
  index sits at the bottom. Columns 2–4 hold the media, 14px top and right
  padding.
- **Media** keeps each image's own aspect ratio (no crop), full column
  width, 1px apart. Changed from a 4:3 `object-cover` crop on 2026-11-18 so
  annotated screenshots aren't clipped.
- **Section row:** 14px above, then a 1px dashed `border` rule and 14px
  padding; label (`muted-foreground`) in the left half, text in the right half
  at max 480px, paragraphs a blank line (20px) apart. Below 810px the label
  stacks above the text.
- **`CaseLightbox`** (`components/brutalist/case-lightbox.tsx`) — every case
  study image is a button (`data-lightbox`, cursor label "Enlarge") that
  opens a full-screen overlay on the page background (`z-30`, above the
  mobile `CaseToc` bar and `Grain`): a muted "n / total" counter and an
  underlined Close on top, the image contained at its largest srcset size in
  between, its alt text (muted) with Prev / Next below, 14px padding and
  gaps throughout. ← / → step, Esc or a click on the backdrop closes (cursor
  label "Close"). Fades 200ms on the house ease-out, instant under reduced
  motion. Focus goes to Close, is trapped inside, and returns to the image without
  its focus ring (`data-focus-returned`, cleared on blur, since closing with
  Esc would otherwise show it);
  the page behind doesn't scroll. `SquareCursor` sits at `z-[100]` so it
  stays above it.
- **`CaseToc`** (`components/brutalist/case-toc.tsx`) — Context plus one entry
  per section. The current one gets a 7px dot, full opacity, and its progress
  (`0%`–`100%`, from its top to the next section's); the rest are at 50% with a
  1px dot. Click to scroll there (instant under reduced motion). Below 1200px
  it is a light bar fixed 14px from the bottom showing the current section,
  with Expand / Collapse for the full list.
- **No footer.** The page ends at its last section; below 1200px a 90px
  spacer keeps the fixed contents bar off it. The email lives in the sidebar
  on home and About.
- **Authoring:** everything before the first `##` is the intro; each `##` is a
  section; a section's `<Figure>`s are lifted out of its text and rendered
  full width beneath the row. `cover` is the first (Context) image. Images
  only: the template's video is not supported.

## Blog post (`app/blog/[slug]/page.tsx`)

The case study page's shell, so a post reads as part of the same site: same
tokens, Geist 14/20, `Grain`, `SquareCursor`, `CaseToc`, and `CaseLightbox`, and
no footer.

- **Sidebar** (sticky, `h-dvh`, scrolls if the index is long): Back link
  home, title, `summary` in `muted-foreground`, then "Published:
  20 Jul 2025" (`formatShortDate`) and "Reading time: n min" (muted), 14px between groups;
  `CaseToc` at the bottom with Intro plus one entry per `##`. Ids come from
  `github-slugger`, as rehype-slug's do.
- **Sections:** text before the first `##` is Intro; each `##` is a section
  row like the case study's (14px above, 1px dashed rule, 14px padding,
  muted label in the left half, text in the right half at max 480px; label
  stacks above the text below 810px). Unlike the case study, figures stay
  where they are in the text and span both halves.
- **Prose:** 20px (a blank line) between blocks; `h3` muted with 14px above;
  lists keep muted markers; blockquote is a 1px left rule, 14px in, muted;
  `strong` is `font-medium`; code is mono on `bg-muted`, no radius; links are
  underlined foreground. Defined in the page's `prose` map, passed to `Mdx`
  as overrides.
- **Figures:** `Mdx figureVariant="brutalist"` renders `<Figure>` /
  `<Gallery>` square-cornered, full row width, as `CaseLightbox` triggers
  ("Enlarge"), with any caption muted 7px below at max 480px. `bleed` is
  ignored there.
- **Older / Newer:** after the last section, 28px above a dashed rule: muted
  "Older" and the title (underlined) in the left half, "Newer" in the right.
  Replaces `PostNav` on this page (`/design` still shows `PostNav`).

## About (`app/about/page.tsx`)

After the layout of emmiwu.com/about (a fixed intro beside numbered rows of
photos and text), in this style. Copy, testimonials, and photos come from
the "Hello" page of the Framer "Yash's Portfolio v2" site, lightly edited
into first person. Linked from the home sidebar's Table of Contents and listed in `sitemap.ts`.

- **Sidebar** (sticky `h-dvh` ≥1200px, column 1 of 4): Back link, "About",
  a two-line bio (7px apart), then the email (`CopyEmail variant="brutalist"`)
  and LinkedIn / GitHub / Resumé, 14px between groups. No `CaseToc`.
- **Rows** (columns 2–4): 14px above a 1px dashed rule, then a 3-column grid
  (≥810px) with 14px gaps: the media in the left two columns, the label
  (`[01] Where I’m from`, muted) and text (max 480px, 7px below the label)
  in the right. Below 810px the text comes first, then the media.
  - 01 Where I’m from, 02 How I work (belief, then the three "what
    differentiates me" points as a `dl`, titles in foreground and text
    muted), 03 Outside of design: up to three photos, 3 to a row, 7px apart,
    cropped to 3:4 (`object-cover`). They're `CaseLightbox` triggers, so
    they open uncropped.
  - 04 Kind words: the three testimonials in the media area, quote in
    foreground, "Name, Role" muted 7px below.
- Photos are static imports from `assets/about/` (intrinsic size and blur).
- Footer, `Grain`, and `SquareCursor` as on the case study; `CustomCursor`
  bows out on `/about` too.

## Open

- Real project images and case studies. `adobe-masks` (from the Framer
  "Yash's Portfolio v2" `/adobe-masks` page, 2026-11-18) is the first real
  one; its images are 16:9. The other home
  cards link to the placeholder `/projects/example` until each has its own.
  `content/projects/example` is placeholder copy at `/projects/example`.
- No Prev / Next between case studies: the template's bar was left out;
  only the sidebar Back link returns home.
