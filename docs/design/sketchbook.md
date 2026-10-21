# The sketchbook world (branch `world/sketchbook`)

**Status: Prototype.** One of three candidate "worlds" (field journal, book,
watercolour sketchbook) built on separate branches so Yash can compare them.
Everything here overrides the achromatic rules elsewhere in these docs *on
this branch only*. The `/design` style guide has not been brought along; it
compiles (the old `WorkStrip` / `WorkCard` still exist for it) but is not the
reference here.

## The idea

The site is Yash's painting sketchbook. Each project is a painted landscape
on its own sheet, pinned up on a page of cold-press paper; the text around
the sheets is pencil.

**Prime motif: the wash.** A wash goes down loose and wet, keeps its happy
accidents, and is then refined in layers. That is how Yash paints and how he
designs, and a cracked tailbone and a summer of painting is how he became a
designer at all. The intro says this in two lines so the metaphor is stated
once, not performed everywhere.

**Against "soft and pretty":** loose paint only ever sits inside a strict
frame: ruled lines, a 12-column grid, one light mono face, pencil notes in
uppercase. Paint never touches type except the faint sky band behind the
header and the wash behind a hovered writing row.

## Second pass (this commit)

The first prototype kept the home page's skeleton (Geist, the horizontal
scroll strip with its stepper) and painted on top of it. This pass builds the
sketchbook out of its own materials:

- **One face.** DM Mono, light (300) for running text, 400 for notes, 500 for
  the headline and emphasis. There is no serif and no sans on the page: the
  paintings are the typography. A `note` utility sets every pencil note the
  same way (11px, letterspaced, uppercase).
- **Sheets, not a strip.** `Sheet` (`components/sheet.tsx`) is a painting on
  its own lit paper with pencil notes in the sheet's bottom margin: the plate
  number, dabs of the three pigments used, and the placeholder tag. The
  project's company and title sit under the sheet. `SheetGrid` pins them up
  two across for selected work and three across for studies, and quiets the
  others when one is hovered. The horizontal `WorkStrip` is no longer on
  home.
- **Re-wetting.** Hovering a sheet lifts it and lets the wash spread 2.5% and
  come up in saturation, as if water touched it again. `motion-safe` only.
- **Writing rows** each carry one dab in the margin and lay a wash of the
  same pigment behind themselves on hover. Dates are short numerics, the way
  a study is dated in its corner.
- **The swatch card.** The colophon is a sheet with every pigment tested as a
  strip (`SwatchStrip`, full strength to a thin wash, a ragged dry end),
  numbered and named by tube. Contact, last wash and Noida time sit beside it.
- **Links** are ultramarine with a dashed pencil underline that fills in on
  hover. The profession blank is set in brackets, `[ product designer ]`.
  The theme toggle reads *Lights off / Lights on*.

## Color

Tokens in `app/globals.css`.

- **Paper and ink.** `--background` is warm cold-press paper; `--foreground`
  blue-black fountain-pen ink; `--muted-foreground` a pencil grey (≈5:1).
- **Plate** (`bg-plate`, `text-plate-foreground`, `border-plate-rule`): the
  sheet under a painting. Nearly identical in both themes.
- **Pigments** (`--pigment-*`): ultramarine, cerulean, indigo, sap green,
  yellow ochre, burnt sienna, quinacridone rose. `pigments` in
  `components/wash.tsx` maps each to its name and variable; `Wash`, `Dab`,
  `SwatchStrip` and the row wash read them as inline `var(--pigment-…)`, the
  one allowed place for `var()` outside a class token.
- **Link** is ultramarine in light, a lit blue in dark.

## Dark mode: lit paper

Transparent watercolour takes its light from the paper; on a dark page it
goes muddy. So dark mode is *the desk at night*: the page turns blue-black,
text turns paper-coloured, and paint only ever appears on lit sheets. The
sky band is hidden, the row wash drops to 35%. Dabs stay because they are
swatches, not paintings.

## Placeholders → scans

Yash has no site-ready paintings. Every `Wash` is generated SVG (seeded,
deterministic, server-rendered) and every sheet carries `PlaceholderTag`.
Grep `PlaceholderTag` to find them all. When scans exist: put them in
`content/projects/<slug>/images/`, load them through `lib/images.ts`
(intrinsic size + blur placeholder, no layout shift) and pass a `next/image`
as `Sheet art`; drop `palette` and `seed`. Scans must be painted from Yash's
own reference photos. The paper tooth (`paper-grain`) is a stand-in for a scan
of his own sheet; the swatch strips for scans of his own tests.

No handwriting fonts, no washi tape, no grid paper. The margin notes are
mono, not script.

## Motion

Hover only. Nothing plays on load. Every transition carries
`motion-reduce:transition-none`, so under reduced motion the hover states
snap instead of easing.
