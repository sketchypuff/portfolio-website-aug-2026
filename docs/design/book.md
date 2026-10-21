# The book (world/book prototype)

**Status: Prototype.** This branch tries one of three candidate "worlds" for
the site (field journal, book, watercolour sketchbook), built so Yash can
compare them. On this branch this file **replaces** the achromatic, minimal
rules in the other topic files. The `/design` style guide has not been
brought along; it compiles but is not the reference here.

## The object

The screen is a table. On it lies **a bound book, open**. The home page is
the book's front matter, opening by opening: frontispiece and title page;
epigraph and preface; contents; list of plates and colophon. Nothing on home
is a web section. Every element is a part of a printed book: boards, a page
block with its fore-edge, a shaded gutter, running heads, folios, rules,
leaders, small capitals, a drop cap, a tissue guard over the frontispiece.

- **Prime motif: the chapter.** Selected work is Chapters I–IV in rubric red;
  other work and writing are Parts Two and Three.
- **Double meaning:** case studies are stories, the subject of Yash's post on
  storytelling in UX case studies.
- **Where the watercolour lives:** the frontispiece under its tissue, and the
  list of plates. Each case study will open on its own plate.

## Third pass (this commit): make it the object

- **Three materials.** `body` is the table (`bg-table`, linen by day, dark at
  night). Each `Spread` has ink-blue cloth boards (`bg-cloth`) around a cream
  page block (`bg-paper`) with a `fore-edge` (alternating page and shadow
  hairlines on both outer edges). The page never changes with the theme; the
  lamp dims it slightly.
- **Pages** (`Page` in `components/book/book.tsx`) have a narrower inner
  margin than outer, a running head at the top outer corner, a folio at the
  bottom outer corner (front matter, so roman: ii–vii), and a soft shade
  where the page meets the gutter. Below `lg` the two pages of a spread stack,
  verso first, each still a full page.
- **The openings.** ii frontispiece under tissue · iii title page (author,
  title, ornament, subtitle, imprint, the three links) · iv epigraph,
  dedication, preface (justified, hyphenated, rubric drop cap) · v contents
  (Part One chapters with leaders to *in draft*, Part Two other work) · vi
  Part Three writing with leaders to dates · vii list of plates and colophon.
- **Hover.** A chapter row rings its plate in the list of plates, and its
  leader turns solid rubric; a thumbnail does the same for its row. The
  frontispiece lifts its tissue on hover. Nothing else moves.
- **Type.** Newsreader only, roman, italic and small caps (`caps`), old-style
  figures, tabular where dates stack (`figures`). Geist Mono is loaded only
  for code in posts.
- The dedication *for Nana, who dropped in* is a suggestion from the identity
  notes; Yash should confirm or cut it.

## Rules

1. **No fake book.** No paper texture, aged edges, page curls or page-flip
   animation. The book is boards, a page block, margins and type. The fore-edge
   lines, gutter shade and tissue are the lighting and parts of a real book,
   not decoration.
2. **Placeholders say so.** Every plate prints "Placeholder · to be painted"
   on itself.
3. **The work stays readable.** Chapter titles are 19px, always visible.
4. **Rubric red is for numbering.** Chapter numerals, the drop cap, ornaments,
   the active plate and leader. Nothing else.
5. **Plates are on the page.** A plate never sits on the cloth or the table.

## Dark mode

Night: the table goes near-black, the cloth a little deeper, and the page is
read by lamplight (`--background` dims a touch). Ink, rubric and paint do not
change.

## Replacing a placeholder with a painting

Add the scan under the chapter's content directory and render it with the
existing image pipeline (`lib/images.ts`) in place of `PlaceholderWash`
inside `Plate` (frontispiece) and in the list of plates. Keep the tissue and
the 4:5 / 4:3 frames so nothing shifts.
