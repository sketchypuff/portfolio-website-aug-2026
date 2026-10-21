# The watercolour world (branch `world/sketchbook`)

**Status: Prototype.** One of three candidate "worlds" (field journal, book,
watercolour), built on separate branches so Yash can compare them. On this
branch this file **replaces** the achromatic rules elsewhere in these docs.
The `/design` style guide has not been brought along; it compiles (the old
`WorkStrip` / `WorkCard` still exist for it) but is not the reference.

## The object

The home page is **one large sheet of cold-press paper that has been painted
on**, lying on a desk. The paper is the world: a sky wash bleeds down from
the top edge and an earth wash up from the bottom, with drips where the board
was tilted and a few flicked drops; headings are underlined with one stroke
of a loaded brush; bullets are blooms of pigment; the headline's blank sits
on a tested swatch of ochre; the work sits on the paper as paintings with
their own ragged edges, no frames; the colophon is the palette, each pigment
tested as a strip.

**Prime motif: the wash.** A wash goes down loose and wet, keeps its happy
accidents, and is refined in layers. That is how Yash paints and how he
designs.

**Loose paint, strict frame.** Every painted thing is loose; every written
thing is straight: a 12-column grid, pencil rules, mono notes, a serif set
with care. The contrast is the look.

## Fourth pass (this commit): the page is the painting

The pile of sheets on a dark desk read as bland. This pass paints the page:

- **Page washes.** `EdgeWash` (`components/wash.tsx`) lays a broad wash in
  from one edge of the sheet with a ragged wet edge, drips, a second pigment
  dropped in wet, and granulation. One at the top (cerulean, ultramarine), one
  at the bottom (ochre, sienna). `Splatter` adds a few drops near each.
- **Brush strokes.** `BrushStroke` is one stroke of a loaded brush, full at
  the start and drying out, with a wobble in the hand. It underlines each
  section heading in that section's pigment and sits behind the profession
  blank in ochre.
- **Paintings, not cards.** Selected work is four 4:3 washes straight on the
  paper, two across, with the plate number, company, three dabs and the title
  pencilled below. Other work is five smaller studies, three across. Hovering
  re-wets a painting (a little spread, a little saturation) and quiets the
  others.
- **Type.** Fraunces (soft, optical sizes, real italic) for everything
  written, headings in italic; DM Mono for the pencil notes via one `note`
  utility.
- **The desk.** `body` is the desk; the sheet (`article`) has a paper grain
  and a shadow and never changes with the theme. Dark mode is the studio at
  night: only the desk goes dark.

## Color

Tokens in `app/globals.css`.

- **Paper and ink.** `--background` is the sheet; `--foreground` blue-black
  ink; `--muted-foreground` pencil.
- **Pigments** (`--pigment-*`): seven tube colours, named in
  `components/wash.tsx`, read as inline `var(--pigment-…)` by `Wash`,
  `EdgeWash`, `BrushStroke`, `Splatter`, `Dab` and `SwatchStrip`. The one
  allowed place for `var()` outside a class token. All paint multiplies over
  the paper.
- **Link** is ultramarine.

## Placeholders → scans

Every `Wash` is generated SVG and every painting carries `PlaceholderTag`.
When scans exist: put them in `content/projects/<slug>/images/`, load them
through `lib/images.ts` (intrinsic size + blur placeholder) and render a
`next/image` inside `Painting` in place of `Wash`; drop `palette` and `seed`.
The page washes, brush strokes and splatter can likewise be replaced by scans
of Yash's own marks, cut out on transparent backgrounds. Scans must be painted
from Yash's own reference photos.

No handwriting fonts, no washi tape, no grid paper.

## Motion

Hover only. Nothing plays on load. Every transition carries
`motion-reduce:transition-none`.
