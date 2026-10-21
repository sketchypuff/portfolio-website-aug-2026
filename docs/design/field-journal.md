# World: the field journal

Branch `world/field-journal`: one of three world prototypes (field journal,
book, watercolour sketchbook) built so Yash can compare them. On this branch
it **overrides** the achromatic, minimal direction in the other topic files
wherever they disagree. Everything here is **Provisional** until Yash picks a
world. The `/design` style guide has not been brought along; it still compiles
but is not the reference for this branch.

## The idea

A naturalist's field journal, open on a desk. One object already holds
everything Yash does: notes in fountain pen, loose landscape washes, and going
out to observe. The page *is* the desk; every entry is a lit sheet on it.

- **Prime motif: the entry.** Each project is one page of the journal: a
  watercolour plate on its own sheet, a typed header (entry number, where,
  status), and ink notes underneath (observed / found / changed).
- **Double meaning:** design is fieldwork. Go out, observe people, come back
  with insight.
- **Tasteful maximalism, Bill Guo's way:** a calm, strict margin (the rail)
  and typed labels frame one rich object, the entries. Richness comes from
  the detail on each entry (plate, caption, dabs, pigment key, notes), not
  from more kinds of thing.

## Second pass (this commit)

The first prototype was a pile of tilted cards in the home page's old
skeleton, with Geist still doing the talking. This pass drops the shadcn look
and builds the journal from its own materials:

- **Type.** Literata (variable, `opsz`, old-style figures) for everything
  written; IBM Plex Mono for everything typed. Geist is gone from this branch.
  One `label` utility (`app/globals.css`) sets every mono label the same way:
  12px, letterspaced, uppercase, lining tabular figures.
- **Layout.** `Container size="wide"`, a 12-column grid. The **rail**
  (`components/journal/rail.tsx`, 3 cols, sticky at `lg`) carries the running
  head and coordinates, the observer flyleaf, an index of the four sections
  with anchor links, the resumé / about / lamp links, and a **key** of the
  pigments on the page. The journal (9 cols) holds the intro and sections
  I–IV. Below `lg` the rail becomes the top of the page.
- **Entries** (`components/journal/entry.tsx`) are stacked full-width pages on
  pencil rules rather than a tilted pile: plate left (5 cols), notes right (7
  cols). The plate's caption carries its number and three dabs of the washes
  used; the notes column repeats them by tube name. Hovering an entry lifts
  the sheet and blooms the wash, and quiets the other entries.
- **Ink links.** `TextLink`, the theme toggle and the profession blank are all
  blue-black ink with a dotted underline that firms up on hover. No boxes, no
  pills. The theme toggle reads "Lamp on / Lamp off".
- **Pill → blank.** `ProfessionPill` is a filled-in blank on a form: ink on a
  dotted baseline. Same cycling behaviour.

## Home, top to bottom (`app/page.tsx`)

| Part | What it is | Built from |
| --- | --- | --- |
| Rail | running head, flyleaf, index, links, pigment key | `Rail` |
| Intro | headline + blank, two paragraphs | Literata 28 / 18 |
| I. Selected work | four `Entry` pages on rules | `EntryList`, `Entry`, `PlaceholderWash` |
| II. Writing | a dated log: No., date, title | ruled rows; titles turn ink on hover |
| III. Loose leaves | other work as specimen tags with a punched hole and one dab | `bg-paper`, `PlaceholderSwatch` |
| IV. Colophon | contact, last entry, Noida time, footnotes | `CopyEmail`, `NoidaTime` |

## Placeholders (must be replaced by Yash's own work)

- **Plates** — `PlaceholderWash`, captioned "Placeholder wash" on the sheet.
  Replace each with a scan loaded through `lib/images.ts`, not from `public/`.
- **Dabs** — `PlaceholderSwatch`. Replace with scanned test dabs.
- **Ink notes** — `Entry` takes optional `notes`. Until they exist each entry
  prints "Notes to follow". Process sketches from Microsoft or Adobe work must
  be redrawn with generic labels (NDA) before they appear on a plate.

No handwriting font and no stock texture, ever. Handwriting appears only as
scans of Yash's own pen.

## Dark mode: lit paper on a dark desk

At night the desk goes dark, and every sheet (`--paper`) stays lit, dimmed a
touch. Text on paper uses `paper-foreground` and `paper-muted`, which do not
change with the theme. Only the shadows change.

## Rules for this world

- The work is the hero: entry titles are 22px Literata and always readable at
  a glance. The frame stays 12px mono and quiet.
- One object carries the richness. No tape, grid paper, stamps, pins or
  doodles, and no second kind of page.
- Loose paint against a strict frame: washes may wander, but rules, labels
  and columns stay straight.
- Motion is hover only. Nothing plays on load.
