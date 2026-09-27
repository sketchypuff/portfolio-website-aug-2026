# Layout, spacing, radius

## Page width — `<Container size>`

Source: `components/container.tsx`. Every page wrapper is a `Container`. It
supplies the gutter (`px-6`, `sm:px-8`) and centering. Never hand-roll
`max-w-*` or horizontal padding on a page wrapper.

Sizes: `prose`, `default`, `wide`, `home`. Nothing else exists.

Choose by the shape of the content, not by what kind of page it is:

```
Is it the home page?
 └── Yes → size="home" (875px column, from Figma)
Does the page lay out images side by side (a card grid)?
 └── Yes → size="wide" (max-w-5xl) — /projects
       also SiteHeader and SiteFooter, so chrome spans wider than content
Is it an index of rows with metadata beside each title (title … date)?
 └── Yes → default (max-w-3xl) — /blog. The extra width is for the
       side-by-side metadata column.
Default → size="prose" (max-w-2xl) — anything that is mostly text read
      top to bottom: posts, case studies, about, 404, short grouped
      lists like a /now page.
```

```tsx
// Correct — app/blog/[slug]/page.tsx
<Container size="prose" className="pt-12 pb-8 sm:pt-16">

// Incorrect — hand-rolled width and gutter
<div className="mx-auto max-w-2xl px-6 pt-12">
```

Inside a page, `max-w-*` on a text block to hold a measure is fine
(`max-w-[436px]` on the home intro, `max-w-2xl` on the projects header).

## Vertical rhythm

**Home (Decided):** sections `gap-20` (80px) apart; section label `gap-8`
(32px) above its content; page `pt-14 pb-16`.

**Inner pages (Provisional):**
- Index pages: `pt-16 sm:pt-24 pb-8`. Detail pages: `pt-12 sm:pt-16 pb-8`.
- Header block → content: `mt-10` (detail), `mt-12` (blog list), `mt-16`
  (project grid).
- Back link → title: `mt-8`. Title → intro: `mt-4`.
- Footer sits `mt-32` below the page.
- Sections within a page: an `h2` styled
  (`text-xl font-medium tracking-tight`), `mt-14` above it, `mt-4` from
  heading to content. Same values as prose `h2` — a TSX page and an MDX page
  should have the same rhythm.
- Items in a list: `space-y-5` (matches prose `my-5`); title → summary
  `mt-1.5` (from `PostLink`).
- Items that are each a link: the row's own padding is the spacing — copy
  `PostLink` (`-mx-3 px-3 py-5` on the link, no `space-y` on the parent).
  Never compensate for row padding with negative margins on the list.

Use the Tailwind spacing scale. Arbitrary spacing (`mt-[37px]`) needs a Figma
value behind it and a comment saying so.

## Horizontal strips (home, Decided)

`WorkStrip` in `app/page.tsx` bleeds to both viewport edges but keeps the first
card aligned to the column via a `--gutter` computed in `cqw` against the
`@container` page wrapper (so it excludes the scrollbar). Cards are `570px`,
`max-w-[85vw]`, snap-start, `gap-6`. The cut-off card at the right edge is the
scroll affordance — do not add arrows or a scrollbar.

If the home column width (875px) changes, update `Container`'s `home` size
**and** the two `--gutter` expressions in `WorkStrip` together.

## Image bleed (prose pages)

`<Figure bleed>` / `<Gallery bleed>` in `components/content/figure.tsx`:
`prose` | `wide` | `full`. Nothing else exists.

```
Is the image a screenshot of UI whose detail must be legible?
 ├── Yes → bleed="wide" (Gallery defaults to this)
 └── No
      ├── A hero or mood image that should dominate → bleed="full"
      └── Default → bleed="prose" (Figure defaults to this)
```

Bleed only applies at `lg`+; below that everything is column width. The
`BLEED` table and `imageSizes()` are paired — changing a margin without its
`lg`/`xl` rem numbers makes the browser download the wrong image size.

## Radius

`--radius` is `0.625rem`. In use:

| Class | Where |
| --- | --- |
| `rounded-xl` | home work cards (Figma) |
| `rounded-lg` | figures, gallery images, project covers, pill, `pre`, focus-ring shape on list rows |
| `rounded-md` | header nav items, theme toggle |
| `rounded` | inline `code` |

Never `rounded-full` on rectangles or `rounded-none` on images. Images are
always rounded.

## Breakpoints

Mobile-first. `sm` (640px) is the main layout switch (stacking → rows); `md`
only for the home headline + pill row; `lg`/`xl` only for image bleed.
