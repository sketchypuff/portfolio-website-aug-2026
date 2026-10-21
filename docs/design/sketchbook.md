# The sketchbook world (branch `world/sketchbook`)

**Status: Prototype.** One of three candidate "worlds" (field journal, book,
watercolour sketchbook) built on separate branches so Yash can compare them.
Everything here overrides the achromatic rules elsewhere in these docs *on
this branch only*. If this world is picked, fold it into the topic files; if
not, the branch is the record.

## The idea

The site is Yash's painting sketchbook. Each project is a painted landscape
on its own sheet; the text around it stays crisp and spare.

**Prime motif: the wash.** A wash goes down loose and wet, keeps its happy
accidents, and is then refined in layers, each deciding a little more. That
is how Yash paints (wet and loose, landscapes) and how he designs (messy
notebook first, then Figma), and a cracked tailbone and a summer of painting
is how he became a designer at all. The colophon says this in one line so
the metaphor is stated once, not performed everywhere.

**Against "soft and pretty":** loose paint only ever sits inside a strict
frame — the 875px column, hairline rules, Geist, mono uppercase labels.
Paint never touches type except the faint band behind the intro.

## What's on the page

| Element | Where | What it is |
| --- | --- | --- |
| Paper | `paper-grain` utility on the home wrapper, `--background` | warm cold-press paper with a generated tooth |
| Masthead | top of `app/page.tsx` | mono row: "Yash Shenai’s sketchbook" · "Noida, India", hairline below |
| Sky band | `Wash variant="band"` behind the header | the page's first wash, bleeding from the top edge; light mode only |
| Plates | `WorkCard` (`size="plate"`, 570px) in Selected work | a painting on its sheet; margin notes `Placeholder wash` · `Pl. 01` |
| Studies | `WorkCard size="study"` (380px) in Other work | smaller sheets, `St. 01` |
| Swatch stepper | `WorkStrip swatches` | stepper ticks become dabs of each card's main pigment, like test swatches in a margin |
| Pigment dabs | `Dab` beside each company name | the three paints in that plate |
| Row wash | writing rows, on hover | a faint pigment wash spreads behind the title |
| Colophon | footer | the wash metaphor in one paragraph, and the palette as a swatch card |

## Color

Tokens in `app/globals.css`.

- **Paper and ink.** `--background` is warm paper `oklch(0.972 0.009 85)`;
  `--foreground` is blue-black fountain-pen ink `oklch(0.24 0.03 262)`;
  `--muted-foreground` a warm pencil grey `0.5 0.018 70` (≈5:1 on paper).
- **Plate** (`bg-plate`, `text-plate-foreground`): the sheet under a
  painting. Identical in both themes.
- **Pigments** (`--pigment-*`, also `bg-pigment-*`): ultramarine, cerulean,
  indigo, sap green, yellow ochre, burnt sienna, quinacridone rose — real
  tube names, shown in mono in the colophon. Identical in both themes.
  `pigments` in `components/wash.tsx` maps each to its name and variable.
  `Wash`, `Dab` and the row wash read them as inline `var(--pigment-…)`
  styles; that is the one allowed place for `var()` outside a class token.
- **Link** is ultramarine in light (`var(--pigment-ultramarine)`), still
  `--blue-300` in dark. Blue still means "takes you somewhere".

## Dark mode (Decided for this prototype): lit paper

Transparent watercolour takes its light from the paper; on a dark page it
goes muddy. So dark mode is *the desk at night*: the page turns blue-black,
text turns paper-coloured, and **paint only ever appears on lit paper** —
plates and studies keep `bg-plate`, the sky band is hidden (`dark:hidden`),
the row wash drops to 40%. Dabs stay because they're swatches, not
paintings. The toggle stays.

## Placeholders → scans

Yash has no site-ready paintings. Every `Wash` is generated SVG (seeded,
deterministic, server-rendered, no JS), and every one is labelled
"Placeholder wash" (`PlaceholderTag`) on the sheet or, for the band, in the
top-right corner. Grep `PlaceholderTag` to find them all.

When scans exist: put them in `content/projects/<slug>/images/`, load them
through `lib/images.ts` (intrinsic size + blur placeholder, no layout
shift) and pass a `next/image` as `WorkCard art`; drop `note`, `palette`
and `seed`. Scans must be painted from Yash's own reference photos. The
paper tooth (`paper-grain`) is a stand-in for a scan of his own sheet.

No handwriting fonts, no washi tape, no grid paper — the margin notes are
mono, not script.

## Motion

Hover and press only. Home has no reveals: `WorkStrip` and `app/page.tsx`
dropped `Reveal`/`RevealGroup`. The route fade in `app/layout.tsx` stays.

| Effect | Classes | Where |
| --- | --- | --- |
| Wash spreads | `duration-500 ease-out group-hover/card:scale-[1.02]` inside an `overflow-hidden` frame | `WorkCard` art |
| Sibling dim | unchanged | Selected work |
| Row wash | `opacity-0 → group-hover:opacity-100`, `duration-300`; blur is static | writing rows |
| Swatch tick | `transition-[scale,opacity] duration-300`; current `scale-125` | `WorkStrip swatches` |

All carry `motion-reduce:transition-none`, so under reduced motion the hover
states snap instead of easing; nothing moves on its own.
