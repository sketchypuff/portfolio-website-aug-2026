# Brutalist home (`brutalist-style` branch)

**Provisional.** On this branch the home page (`app/page.tsx`) is rebuilt
to match the layout of the Plyń Framer portfolio template
(plyn-chacviorty.framer.website), measured from the live page on
2026-11-18. The copy is Yash's own; none of the template's text or photos are used.
The blog post page is unchanged and keeps the site theme.

## Tokens

The page has one fixed dark palette whatever the site theme, scoped in
`app/globals.css` to `.brutalist` (and `:root:has(.brutalist)`, so the body
matches): `background` #121212, `foreground` #f0f0f0, `muted-foreground`
#f4f4f4 at 50%, `border` #f4f4f4 at 10%, `muted` #1e1e1e (image
placeholders). Components still use the semantic classes.

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
  apart, underlined links 4px apart, 14px between groups.
- Cards: image, then title 7px below, `muted-foreground` subtitle; 28px between rows.
  Image ratios cycle 4:5, 1:1, 4:3, 1:1 (`ASPECTS`).
- Copyright is `fixed` 14px from the bottom: left ≥1200, right below.

## Behaviour

- **Hover dim** — hovering a card drops every other card to 50% opacity,
  300ms (`group-has-[li:hover]/grid`). CSS only.
- **`MonoToggle`** (`components/brutalist/mono-toggle.tsx`) — the sun. It sets
  `data-mono` on the wrapper, and the images go grayscale
  (`group-data-mono/page:grayscale`). It does not change the theme.
- **`DotCursor`** (`components/brutalist/dot-cursor.tsx`) — 32px white dot,
  `mix-blend-exclusion`, trails the pointer at 0.25 per frame. Replaces
  `CustomCursor`, which bows out on `/` and `/projects/*`. Fine pointers
  >768px only; none under reduced motion.
  Over an element with `data-cursor-text`, the label (14/20, white, same
  exclusion blend) types out 7px right of the dot over at most 160ms and
  deletes itself on the way out — the typing from `main`'s `CustomCursor`.
  Each work card's link carries `data-cursor-text="View case study"`.
- **`Grain`** (`components/brutalist/grain.tsx`) — fixed canvas of random
  gray noise at 15% `soft-light`, redrawn every 80ms; static under reduced
  motion.
- Email uses `CopyEmail` with the address as its label.

## Case study (`app/projects/[slug]/page.tsx`)

After the template's project page (plyn-piaty.framer.website/void-ai), less
its white frame and its Close / Prev / Next bar, which Yash left out. Same
tokens, type, `Grain`, and `DotCursor` as home.

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
- **`CaseToc`** (`components/brutalist/case-toc.tsx`) — Context plus one entry
  per section. The current one gets a 7px dot, full opacity, and its progress
  (`0%`–`100%`, from its top to the next section's); the rest are at 50% with a
  1px dot. Click to scroll there (instant under reduced motion). Below 1200px
  it is a light bar fixed 14px from the bottom showing the current section,
  with Expand / Collapse for the full list.
- **Footer:** centered "Have an idea in mind? Drop me a line!" (muted) and the
  email as `CopyEmail`. In the template it sits on the white frame; here it is
  on the dark page.
- **Authoring:** everything before the first `##` is the intro; each `##` is a
  section; a section's `<Figure>`s are lifted out of its text and rendered
  full width beneath the row. `cover` is the first (Context) image. Images
  only: the template's video is not supported.

## Open

- Real project images and case studies. `adobe-masks` (from the Framer
  "Yash's Portfolio v2" `/adobe-masks` page, 2026-11-18) is the first real
  one; its images are 16:9. The other home
  cards link to the placeholder `/projects/example` until each has its own.
  `content/projects/example` is placeholder copy at `/projects/example`.
- No Prev / Next between case studies: the template's bar was left out;
  only the sidebar Back link returns home.
- Whether the brutalist palette and type spread to the blog page.
