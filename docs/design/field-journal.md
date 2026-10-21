# World: the field journal

Branch `world/field-journal`: one of three world prototypes (field journal,
book, watercolour sketchbook) built so Yash can compare them. On this branch
it **overrides** the achromatic, minimal direction in the other topic files
wherever they disagree. Everything here is **Provisional** until Yash picks a
world.

## The idea

A naturalist's field journal: ink observations beside watercolour plates,
dated entries, small mono labels. It is one object that already holds
everything Yash does: notes in fountain pen, loose landscape washes, and
going out to observe.

- **Prime motif: the entry.** Each project is one page of the journal: a
  numbered header, a watercolour plate, ink notes underneath.
- **Double meaning:** design is fieldwork. Go out, observe people, come back
  with insight ("Your research is only as good as its insights").
- **Tasteful maximalism, Bill Guo's way:** a calm, strict text frame (running
  head, flyleaf, numbered sections, pencil rules, mono labels) with all the
  richness in one real object: the entries.

## Home, top to bottom (`app/page.tsx`)

| Part | What it is | Built from |
| --- | --- | --- |
| Running head | "Field journal · Notes from product design, kept on paper first · 28.54° N, 77.39° E" | mono label row on a rule |
| Intro | headline + `ProfessionPill`, two intro paragraphs; Index nav at right | serif, `TextLink`, `ThemeTextToggle` |
| Flyleaf | Observer / Station / Field / Trained: who keeps the journal | `dl`, mono terms, serif details |
| I. Selected work | the spread: four `Entry` pages, tilted, right column dropped | `EntrySpread`, `Entry`, `PlaceholderWash` |
| II. Writing | a dated log: number, date, title | ruled rows, linked titles turn ink-blue |
| III. Other work | "loose leaves": specimen tags with a punched hole and one test dab | `bg-paper` tags, `PlaceholderSwatch` |
| IV. Colophon | contact, last entry, Noida time, and a footnote: "Fauna sighted on this page: one cat, wandering" | `CopyEmail`, `NoidaTime` |

The cat (`Oneko`) stays, and the colophon logs it as fauna.

## Placeholders (must be replaced by Yash's own work)

- **Plates** — `PlaceholderWash` draws a loose SVG landscape (wet-in-wet sky,
  wet-on-dry ridge and land, granulation, a bare-paper margin) and every
  plate is captioned "Placeholder wash · scan to come". Replace each with a
  scan loaded through `lib/images.ts` (intrinsic size + blur placeholder),
  not from `public/`.
- **Swatches** — `PlaceholderSwatch` dabs on the specimen tags. Replace with
  scanned test dabs from his palette.
- **Ink notes** — `Entry` takes optional `notes` (observed / found /
  changed). None are written yet; until then the project line stands alone.
- Process sketches from Microsoft or Adobe work must be redrawn with generic
  labels (NDA) before they appear on a plate.

No handwriting font and no stock texture, ever. Handwriting appears only as
scans of Yash's own pen.

## Dark mode: lit paper on a dark desk (Decided for this prototype)

At night the page becomes a dark, warm desk, but every entry, plate and
specimen tag stays **lit paper** (`--paper`, nearly the same in both themes,
dimmed slightly at night). Scans and washes are always seen on paper, so
they never go muddy on a dark ground. Text on paper uses `paper-foreground`
and `paper-muted`, which do not change with the theme.

## Rules for this world

- The work is the hero: entry titles are 18px serif and always readable at a
  glance. The frame stays mono 12px and quiet.
- One object carries the richness. Don't add tape, grid paper, stamps, pins,
  doodles, or a second kind of page.
- Loose paint against a strict frame: washes may wander, but rules, labels
  and columns stay straight.
- Motion is hover only (see [motion.md](motion.md)); nothing plays on load
  on home.
