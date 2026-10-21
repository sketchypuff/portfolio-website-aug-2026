# The book (world/book prototype)

**Status: Prototype.** This branch tries one of three candidate "worlds" for
the site (field journal, book, watercolour sketchbook), built so Yash can
compare them. Where this file disagrees with the achromatic, minimal rules in
the other topic files, this file wins *on this branch only*. If the book is
chosen, fold these rules into the topic files and delete this banner.

## The world

The site is a novel. The home page is its **contents page**, each case study
will be a **chapter** opening on a painted **frontispiece**, and the footer is
the **colophon**.

- **Prime motif: the chapter.** Selected work is numbered I–IV in rubric red,
  like chapters; other work and writing are Parts Two and Three.
- **Double meaning:** case studies are stories — the subject of Yash's post
  on storytelling in UX case studies.
- **Where the watercolour lives:** in the plates. The verso (left page) holds
  a frontispiece that turns to each chapter's plate on hover, and a "list of
  plates" shows all four at once so the paintings are never only a hover away.

## The spread (`components/book/contents-spread.tsx`)

```
lg and up                                 below lg
┌──────────── running head ────────────┐  running head
│ verso (5fr)      │ recto (7fr)       │  frontispiece (landscape)
│ sticky Plate     │ title page        │  title page
│ list of plates   │ Contents          │  Contents — each chapter with
│                  │  Part One  I–IV   │    its own inline plate
│                  │  Part Two         │  Part Two, Part Three
│                  │  Part Three       │
└──────── gutter rule between ─────────┘
              colophon (centered)
```

`Container size="wide"`. The gutter is a 1px `bg-border` rule. Below `lg`
nothing depends on hover.

## Rules

1. **No fake book.** No paper texture, aged edges, leather, page curls or
   page-flip animation. The book comes from real book typography — rubrics,
   a drop cap, small-caps headings, dotted leaders, a colophon, a fleuron —
   and, later, real paintings.
2. **Placeholders say so.** Every plate prints "Placeholder · to be painted"
   on itself. Never ship a placeholder wash as if it were Yash's painting, and
   never replace one with stock imagery or a texture.
3. **The work stays readable.** Chapter titles are 20px serif, always visible,
   never hidden behind hover. The plates are the frame, not the content.
4. **Rubric red is for numbering.** `text-rubric` goes on chapter numerals,
   the drop cap, the colophon fleuron, and the active plate in the list of
   plates. Nothing else.
5. **Plates are lit paper.** A plate's sheet is `bg-paper` in both themes.

## Dark mode (decided for this prototype)

Dark is the **cloth binding**: a warm near-black page with cream type. Plates
stay **lit paper cards** (`--paper` does not change), so a scanned watercolour
never sits on a dark ground and never looks muddy. Light-only was the
alternative; it was rejected because the home page already ships a theme
toggle and the lit plate reads well against the dark board.

## Typography

| Role | Classes |
| --- | --- |
| Headline (title page) | `font-serif text-[1.75rem] leading-tight font-normal` |
| Preface | `font-serif text-lg leading-relaxed font-normal`; first letter a 3-line rubric drop cap |
| "Contents", "Colophon" | `font-serif text-sm uppercase tracking-[0.2em]` — letterspaced caps, the one tracking exception |
| Chapter numeral | `text-rubric font-serif text-xl` |
| Chapter title | `font-serif text-xl leading-snug font-normal` |
| Other work, writing rows | `font-serif text-base font-normal` |
| Labels, companies, dates, part headings | `font-mono text-xs uppercase`, muted |
| Colophon prose | `font-serif italic`, muted |

Newsreader (`--font-newsreader`, `font-serif`) with the `opsz` axis, so each
size is set at its own optical size. Geist Mono stays for labels: crisp
mono set against loose paint is what keeps the watercolour from reading as
soft. UI controls (pill, links, email) stay Geist Sans.

## Motion

Quiet hovers only, all CSS:

| Effect | Classes |
| --- | --- |
| Plate turn | stacked plates, `transition-opacity duration-300 ease-out` |
| Chapter dim | the WorkStrip sibling-dim pattern on the chapter `<ol>` |
| List-of-plates ring | `transition-shadow duration-200 ease-out` |

Every one carries `motion-reduce:transition-none`. Reveals are the existing
`Reveal` / `RevealGroup`. No page-turn, no parallax, no loader.

## Replacing a placeholder with a painting

Add the scan under the chapter's content directory and render it with the
existing image pipeline (`lib/images.ts` → intrinsic size + blur
placeholder) in place of `PlaceholderWash` inside `Plate`. Keep the `bg-paper`
sheet and the 4:5 (verso) / 3:2 (inline) frames so nothing shifts.
