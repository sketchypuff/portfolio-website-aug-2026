# The book (world/book prototype)

**Status: Prototype.** This branch tries one of three candidate "worlds" for
the site (field journal, book, watercolour sketchbook), built so Yash can
compare them. Where this file disagrees with the achromatic, minimal rules in
the other topic files, this file wins *on this branch only*. The `/design`
style guide has not been brought along; it compiles but is not the reference
here.

## The world

The site is a novel. The home page is its **title page and contents**, each
case study will be a **chapter** opening on a painted **frontispiece**, and
the footer is the **colophon**.

- **Prime motif: the chapter.** Selected work is numbered I–IV in rubric red;
  other work and writing are Parts Two and Three.
- **Double meaning:** case studies are stories, the subject of Yash's post on
  storytelling in UX case studies.
- **Where the watercolour lives:** in the plates. The verso holds the
  frontispiece under a tissue guard; hovering a chapter lifts the tissue and
  turns to that chapter's plate. A list of plates shows all four at once.

## Second pass (this commit)

The first prototype kept Geist and mono labels around a serif. This pass
makes the page out of what a printed book is made of, and nothing else:

- **One face.** Newsreader in roman, italic and small caps. Geist Sans is
  gone; Geist Mono is loaded only for code in blog posts and the home page
  sets nothing in it. Old-style figures everywhere (`html`), tabular where
  dates stack (`figures`). Letterspaced small caps come from one utility,
  `caps`, used for running heads, part titles, captions and labels.
- **A real title page.** Centred: a half-title line, the headline with the
  profession blank set in italic ink, an epigraph (the "opinionated and
  delightful" line in quotation marks), a dedication, and a preface with a
  rubric drop cap. The dedication reads *for Nana, who dropped in*: it is a
  suggestion from the identity notes, and Yash should confirm or cut it.
- **Tissue guards.** `Plate` takes `guarded` and `lifted`. On the verso the
  frontispiece rests under a translucent sheet printed with its number; hovering
  the plate, a chapter, or a thumbnail lifts it. It is the one "book object"
  detail on the page, and it is a real one.
- **Part headings** are centred small caps between rules, like a novel's part
  openings, and the chapter rows carry a leader from the company to *in
  draft* in italic.
- **Links** are ink blue with a hairline underline. The theme toggle reads
  *Lamplight / Daylight*. No pills, boxes or icons apart from the ↗ on the
  resumé.
- **Colophon** is centred under a fleuron, with the correspondence, edition
  date, and the author's local time.

## The spread (`components/book/contents-spread.tsx`)

```
lg and up                                   below lg
┌──────────── running head ──────────────┐  running head
│ verso (5fr)       │ recto (7fr)        │  frontispiece (landscape)
│ sticky Plate      │ title page         │  title page
│  under tissue     │ Contents           │  Contents — each chapter with
│ list of plates    │  Part One  I–IV    │    its own inline plate
│                   │  Part Two          │  Part Two, Part Three
│                   │  Part Three        │
└──────── gutter rule between ───────────┘
              colophon (centred)
```

`Container size="wide"`. The gutter is a 1px `bg-rule`. Below `lg` nothing
depends on hover.

## Rules

1. **No fake book.** No paper texture, aged edges, leather, page curls or
   page-flip animation. The book comes from real book typography and, later,
   real paintings. The tissue guard is allowed because bound plates have one.
2. **Placeholders say so.** Every plate prints "Placeholder · to be painted"
   on itself. Never ship a placeholder wash as if it were Yash's painting.
3. **The work stays readable.** Chapter titles are 20px, always visible,
   never hidden behind hover.
4. **Rubric red is for numbering.** `text-rubric` goes on chapter numerals,
   the drop cap, the fleuron, and the active plate in the list of plates.
5. **Plates are lit paper.** A plate's sheet is `bg-paper` in both themes.

## Dark mode

Dark is the **cloth binding**: a warm near-black board with cream type.
Plates stay lit paper cards (`--paper` does not change) so a scanned
watercolour never sits on a dark ground.

## Replacing a placeholder with a painting

Add the scan under the chapter's content directory and render it with the
existing image pipeline (`lib/images.ts`) in place of `PlaceholderWash`
inside `Plate`. Keep the `bg-paper` sheet, the tissue, and the 4:5 (verso) /
3:2 (inline) frames so nothing shifts.
