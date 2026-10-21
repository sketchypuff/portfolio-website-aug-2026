# World: the field journal

Branch `world/field-journal`: one of three world prototypes (field journal,
book, watercolour sketchbook) built so Yash can compare them. On this branch
it **replaces** the achromatic, minimal direction in the other topic files.
Everything here is **Provisional** until Yash picks a world. The `/design`
style guide has not been brought along; it compiles but is not the reference.

## The object

The screen is a desk. On it lies **one open page of a naturalist's field
journal**, and everything on the site is written on that page. Nothing on
home is a web section: the running head, the red margin rule, the index tabs
cut into the fore-edge, the flyleaf, the numbered entries, the specimen tags
and the colophon are all parts of the notebook.

- **Prime motif: the entry.** Each project is one entry: a number in the
  margin, a plate painted straight onto the page with pencil callouts
  pointing into it, and the written entry beside it (observed / found /
  changed).
- **Double meaning:** design is fieldwork. Go out, observe people, come back
  with insight. The callouts are the visual of that: labels with leader lines
  into the thing observed.
- **Tasteful maximalism, Bill Guo's way:** the page is the calm frame; the
  richness is in the entry (plate, callouts, caption, margin number, notes).

## Third pass (this commit): make it the object

The previous passes kept a web skeleton (a column, sections on ruled
headings, cards on shadows). This pass throws that out:

- **The desk and the page.** `body` is `bg-desk` (warm linen by day, dark
  wood by night). `JournalPage` (`components/journal/page-frame.tsx`) is the
  single cream sheet, max 1100px, with a page shadow, a red margin rule at
  `--margin-x`, and fore-edge **index tabs** at the right on `lg` (a
  `TabRow` of tags below that). The page never changes with the theme: dark
  mode only darkens the desk and dims the page a touch (`--background`).
- **The margin.** `MarginNote` writes left of the red rule, aligned to its
  first line: the date on the flyleaf, section numerals, entry numbers,
  note numbers. `journal-page` in `globals.css` holds the geometry.
- **Annotated plates.** `Entry` paints the wash directly on the page inside
  a hairline pencil frame (no sheet, no card) and draws three pencil leader
  lines from labels at the right to points on the plate. Until the scans and
  notes exist the labels name the washes (Cerulean, sky, wet-in-wet). Hovering
  an entry darkens the lines and blooms the wash.
- **Specimen tags** (`components/journal/specimen-tag.tsx`) are manila tags
  with a clipped corner, a reinforced hole with its string, one test dab and
  a typed number. Each lies at its own slight angle.
- **Type.** Alegreya (a calligraphic book face, real italic) for everything
  written; section titles in Alegreya small capitals. IBM Plex Mono for
  everything typed, via one `label` utility. Geist is gone.
- **Flyleaf** rows use dotted leaders from term to detail, like a filled-in
  form. The theme toggle reads *Lamp on / Lamp off*; "Currently" is
  "Conditions", as a journal logs them.

## Home, top to bottom (`app/page.tsx`)

| Part | What it is |
| --- | --- |
| Running head | "Field journal · Vol. I" · coordinates · "p. 1" on a rule |
| Tabs | fore-edge tabs at `lg`; a row of tags below |
| First page | date in the margin; headline + ink blank; two paragraphs; flyleaf table; résumé / about / lamp |
| I. Selected work | four numbered entries with annotated plates |
| II. Notes | the writing, numbered in the margin, dated in mono |
| III. Loose leaves | other work on specimen tags |
| IV. Colophon | contact, last entry, conditions, footnotes |

## Placeholders (must be replaced by Yash's own work)

- **Plates** — `PlaceholderWash`, labelled "Placeholder wash" on the plate.
  Replace with scans loaded through `lib/images.ts`, keeping the 4:3 frame.
- **Callouts** — currently name the washes; replace their text with real
  observations when the notes are written. The leader geometry is in
  `CALLOUTS` in `entry.tsx`.
- **Dabs** — `PlaceholderSwatch`. Replace with scanned test dabs.
- **Ink notes** — `Entry` takes optional `notes`; until then each entry
  prints "Entry to be written up".

No handwriting font and no stock texture, ever. Handwriting appears only as
scans of Yash's own pen.

## Rules for this world

- The work is the hero: entry titles are 23px Alegreya and always readable.
  The frame stays 11px mono and quiet.
- One object carries the richness. No tape, grid paper, stamps or doodles,
  and no second kind of page.
- Loose paint against a strict frame: washes may wander; rules, labels and
  leader lines stay straight.
- Motion is hover only. Nothing plays on load.
