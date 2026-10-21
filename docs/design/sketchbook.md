# The sketchbook world (branch `world/sketchbook`)

**Status: Prototype.** One of three candidate "worlds" (field journal, book,
watercolour sketchbook) built on separate branches so Yash can compare them.
On this branch this file **replaces** the achromatic rules elsewhere in these
docs. The `/design` style guide has not been brought along; it compiles (the
old `WorkStrip` / `WorkCard` still exist for it) but is not the reference.

## The object

The screen is a desk covered with a sheet of cream paper. On it, **a pile of
studies**: every project is a painting on its own sheet of cold-press paper,
tipped out of a folder and lying where it fell, overlapping, each at its own
angle. The pile *is* the index of the work, the way Bill Guo's pile of stamps
is his. Beside the pile, pencilled on the paper, are the notes: who, what,
where the writing is, how to get in touch.

**Prime motif: the wash.** A wash goes down loose and wet, keeps its happy
accidents, and is then refined in layers. That is how Yash paints and how he
designs.

**Against "soft and pretty":** loose paint, strict frame. One light mono face
for every word; hairline rules; the sheets are rectangles with square
corners; only their angles are loose.

## Third pass (this commit): make it the object

The previous passes pinned sheets into a grid under ruled headings, which is
a web page with paintings in it. This pass throws the grid away:

- **The pile** (`components/pile.tsx`). At `lg` the desk is a square and the
  ten sheets (four plates, five studies, one swatch card) sit at the
  positions and angles in `PLACES`, overlapping. Hovering a sheet squares it
  up, lifts it to the top and brings the paint up; every other sheet goes
  soft (1.5px blur, 70%) underneath, with no JavaScript. Below `lg` the
  sheets flow in a two-column grid, each tilted a degree, so nothing depends
  on absolute positions on a phone.
- **The sheet is self-contained.** Number and company, three pigment dabs,
  the title, and the placeholder tag are all pencilled in the sheet's own
  margin, so a sheet means something on its own, like a stamp.
- **The notes column** at the left carries the masthead, the headline with
  the bracketed blank, the two paragraphs, the links, the writing (each note
  with a dab and a short date), and contact / last wash / Noida time. Nothing
  is a card; it is pencil on the paper.
- **One face.** DM Mono, light for running text, 400 for notes, 500 for the
  headline. The sky band is gone: paint only ever sits on sheets.

## Color

Tokens in `app/globals.css`.

- **Paper and ink.** `--background` is warm cold-press paper with a tooth
  (`paper-grain`); `--foreground` blue-black ink; `--muted-foreground` pencil.
- **Plate** (`bg-plate`, `text-plate-foreground`, `border-plate-rule`): the
  whiter sheet a painting is on. Nearly identical in both themes.
- **Pigments** (`--pigment-*`): seven tube colours, named in
  `components/wash.tsx`, read as inline `var(--pigment-…)` by `Wash`, `Dab`
  and `SwatchStrip`. The one allowed place for `var()` outside a class token.
- **Link** is ultramarine in light, a lit blue at night.

## Dark mode: the desk at night

The paper the desk is covered with goes blue-black, the pencil turns
paper-coloured, and paint only ever appears on the lit sheets. Dabs stay
because they are swatches, not paintings.

## Placeholders → scans

Every `Wash` is generated SVG and every sheet carries `PlaceholderTag`. When
scans exist: put them in `content/projects/<slug>/images/`, load them through
`lib/images.ts` (intrinsic size + blur placeholder) and render a `next/image`
in `SheetFace` in place of `Wash`; drop `palette` and `seed`. Scans must be
painted from Yash's own reference photos. The paper tooth is a stand-in for a
scan of his own sheet; the swatch strips for scans of his own tests.

No handwriting fonts, no washi tape, no grid paper, no pins.

## Motion

Hover only. Nothing plays on load. Every transition carries
`motion-reduce:transition-none`.
