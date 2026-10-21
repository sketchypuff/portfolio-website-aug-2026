# Brief: a "world" for yashshenai.com

This brief is self-contained. It sums up a long self-discovery conversation
with Yash Shenai about giving his portfolio site a personality. The fuller raw
notes are in `docs/identity.md`, if that file is in your checkout.

## The problem

yashshenai.com (this repo) is a quiet, achromatic, minimal portfolio. Yash
finds it **too bland**. He wants it to have a personality that is clearly
*his*, expressed as a single coherent **world**, the way these sites do:

- **[billguo.me](https://billguo.me/)**: the world is his Chinese roots. The prime motif is the
  postage stamp: projects *are* stamps on cream paper, sorted into piles.
  The stamp has a double meaning: it's cultural, *and* seals/stamps were how
  branding worked historically, and Bill designs brand identities. **Yash
  considers this the right amount of "tasteful maximalism".**
- **[darshitapatankar.com](https://www.darshitapatankar.com/)**: the world is Barbie + Y2K ("Welcome to
  Darshita's", projects as "Today's Specials"). Too loud for Yash, but the
  same principle applies.

### References

| Site | Why it's here |
| --- | --- |
| [Bill Guo](https://billguo.me/) | **The benchmark** for the right amount of tasteful maximalism: a calm text grid as the frame, with all the richness in one real object (stamps) that holds the work. Hovering a stamp lifts it, blurs the others, and reveals a faint ink-brush painting behind. The home page fits on one screen. |
| [Darshita Patankar](https://www.darshitapatankar.com/) | A world built from a recognisable movement (Barbie + Y2K) and a "place" framing (a venue sign, a menu of specials). Take the principle, not the look: it's too loud and glowing for Yash, and its ~10s loader is something to avoid. |

Look at both before designing. They show the principle the three worlds
below are trying to apply.

## The framework (agreed with Yash)

A good world is:

1. **A recognisable aesthetic the audience already knows.** The audience is
   designers and recruiters, many outside India. Hyper-local references
   (Mumbai, Indian Railways, his childhood) won't land as the world itself.
2. **× Yash's genuine, *current* connection to it.** Not his past
   biography. Something being in his history doesn't make it his identity now.
3. **× one prime motif that doubles as a metaphor for product design**,
   like Bill's stamp.

It must be **one singular world**. An earlier idea (a notebook with four kinds
of page) was rejected as too complex.

## Who Yash is (the parts that matter here)

- Product designer at Microsoft (agentic AI in Excel and PowerPoint);
  previously Adobe, Postman, Samsung. Trained as an industrial designer at
  NID, India, then moved to digital product design. 26, from Navi Mumbai,
  Maharashtrian, Marathi-speaking. Lives in Noida now.
- **Watercolour painter**: landscapes only, **wet and loose**, never tight
  or controlled. Paints from reference photos rather than on location. His
  grandfather (nana) was an oil painter. He became a designer after cracking
  his tailbone in 12th grade, staying home, and painting instead of
  preparing for engineering entrance exams.
- **Designs on paper first**: messy thinking goes into a notebook with his
  **Pilot Metropolitan fountain pen** until it's clear, then into Figma for
  fidelity. Loves the messy, focused middle of making; dislikes the final
  handoff.
- **Values truth to materials**: drawn to brutalism, where the material's
  natural state is the attraction, not decoration added on top.
- **Reads fiction**: sci-fi, thrillers, fantasy, literary fiction. Wrote a
  post called "How to use storytelling in UX case studies".
- Believes "all software should be opinionated and delightful to use in
  order to be called usable."
- Voice: warm, playful, a bit street-level. The current headline says he
  makes agentic AI experiences "feel oh yeah!".

## Hard constraints for the design

- **Tasteful maximalism, not minimalism.** Rich, layered, abundant, with every
  element placed on purpose. Bill's site is the benchmark.
- **No** crazy motion, **no** huge type, **no** operating-system-style
  sites, **no** ultra-maximalist chaos.
- **The work is the hero.** Case studies and projects must stay readable
  and easy to scan; the personality lives in the frame around them.
- Should feel **crafted and made with good intent**, not extravagant.
- Fast: no loader screens.
- Any painting, ink or handwriting must be **Yash's own** (scans), never a
  handwriting font or stock texture. He has no site-ready paintings yet.
- **Rejected worlds** (don't re-propose): Eames / mid-century modern, anime
  background art, maker's workshop / industrial design, sports trading
  cards, Mumbai/India street culture as the main world, and a multi-page-type
  notebook.

## The three candidate worlds

### 1. The field journal (current lead)

- **World:** a naturalist's field journal. Old explorers' and botanists'
  notebooks: ink observations next to watercolour plates, dated entries,
  small labels. A long-standing, widely recognised aesthetic.
- **Why it's singular:** a field journal already *is* ink + watercolour +
  observation. His working notes, his ink-and-wash painting and the idea of
  research all belong to the same object naturally.
- **Prime motif: the entry.** Each project is one entry: a small watercolour
  plate by Yash at the top, ink notes underneath (what he observed, what he
  found, what changed).
- **Double meaning:** design is fieldwork: go out, observe people, come back
  with insight. It echoes Yash's own line, "Your research is only as good as
  its insights."
- **Home page:** a spread of entries, like Bill's pile of stamps. Hovering
  an entry lifts it, and its watercolour plate blooms slightly.

### 2. The book

- **World:** the site is a novel. The home page is a contents page, each case
  study is a chapter with a painted frontispiece, and the footer is a
  colophon.
- **Prime motif: the chapter.**
- **Double meaning:** case studies are stories, the subject of his
  storytelling-in-case-studies post.
- **Trade-off:** suits a fiction reader and is very calm, but leans towards
  "Yash as writer" more than "designer who paints"; watercolour becomes
  secondary.

### 3. The watercolour sketchbook

- **World:** purely his painting sketchbook. Projects are painted
  landscapes, with the text kept minimal.
- **Prime motif: the wash.**
- **Double meaning:** iteration and happy accidents, which is also his
  origin story.
- **Trade-off:** the most personal, but it relies entirely on paintings he
  doesn't have yet and reads as "painter" more than "product designer".

## Risks to keep in mind for any of them

- **Generic sketchbook clichés** (grid paper, washi tape, handwriting
  fonts). The fix: his real ink, his real washes, real process.
- **Watercolour reading as soft or "pretty".** The fix: set loose paint
  against a strict grid, mono labels and crisp type. That's both of his
  values together.
- **Copyright:** he paints from other people's photos and paintings.
  Anything published on the site should be painted from **his own**
  reference photos.
- **Dark mode:** scans look muddy on dark backgrounds. Decide early: show
  them as lit paper cards, or make the site light-only.
- **Performance:** use the repo's existing image pipeline (`lib/images.ts`,
  blur placeholders, no layout shift).
- **NDAs:** process sketches from Microsoft or Adobe work need re-drawing
  with generic labels.

## Task for this session

> Edit this section before sending if you want something different.

Prototype the three worlds so Yash can compare them on screen before he
paints anything:

1. Read `AGENTS.md` and `DESIGN.md` first, and follow them. This is Next.js
   16; read the relevant guide in `node_modules/next/dist/docs/` before
   writing Next-specific code.
2. Build each world as a home-page prototype on a throwaway, `noindex` route
   (for example `/proto/field-journal`, `/proto/book`, `/proto/sketchbook`),
   kept out of the sitemap and nav. Use the real content from
   `app/page.tsx`: intro, selected work, writing, contact.
3. Use clearly marked placeholder washes and ink where Yash's own scans will
   go later. Don't use stock imagery or handwriting fonts.
4. Respect the hard constraints above, and keep each prototype's motion to
   quiet hovers that render statically under reduced motion.
5. Run `npm run build` to verify. **Don't commit or push** unless Yash asks.
6. Finish with a short comparison of the three: what worked, what didn't,
   and which you'd develop further and why.
