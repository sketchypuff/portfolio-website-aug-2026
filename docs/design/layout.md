# Layout, spacing, radius

## Page width — `<Container size>`

Source: `components/container.tsx`. Every page wrapper is a `Container`. It
supplies the gutter (`px-6`, `sm:px-8`) and centering. Never hand-roll
`max-w-*` or horizontal padding on a page wrapper.

Sizes: `home`, `prose`, `default`, `wide`. Nothing else exists.

```
Is it the home page, or a page built in the home language?
 └── size="home" (875px column, from Figma) — the only Decided width
Is it long-form reading (a post or case study body)?
 └── size="prose" (max-w-2xl, ~70 characters at 16px)
Anything else
 └── No page uses `default` (max-w-3xl) or `wide` (max-w-5xl) today. Pick
     one only when a Figma frame calls for it, and record which page uses it.
```

```tsx
// Correct — app/page.tsx
<Container size="home" className="flex flex-col gap-20 pt-14 pb-16 …">

// Incorrect — hand-rolled width and gutter
<div className="mx-auto max-w-[939px] px-6 pt-14">
```

Inside a page, `max-w-*` on a text block to hold a measure is fine
(`max-w-[436px]` on the home intro).

## Vertical rhythm (Decided, from home)

- Sections `gap-20` (80px) apart.
- Section label → its content: `gap-8` (32px).
- Page padding: `pt-14 pb-16`.
- Row lists: `py-3` per row, 0.5px hairline between rows.
- Card text below its image: `mt-5`.

Use the Tailwind spacing scale. Arbitrary spacing (`mt-[37px]`) needs a Figma
value behind it and a comment saying so. Rows that are each a link get their
spacing from the row's own padding — never compensate for padding with
negative margins on the list.

## Horizontal strips (Decided)

`WorkStrip` (`components/work-strip.tsx`) bleeds to both viewport edges but
keeps the first card aligned to the column via a `--gutter` computed in `cqw`
against the `@container` page wrapper (so it excludes the scrollbar). Cards
are `570px`, `max-w-[85vw]`, snap-start, `gap-6`. The cut-off card at the
right edge is the scroll affordance — do not add arrows or a scrollbar.

If the home column width (875px) changes, update `Container`'s `home` size
**and** the two `--gutter` expressions in `WorkStrip` together.

## Image bleed (Provisional)

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
Both assume a `prose` container; revisit them if articles move to `home`.

## Radius

`--radius` is `0.625rem`. In use:

| Class | Where |
| --- | --- |
| `rounded-xl` | home work cards (Figma) |
| `rounded-lg` | figures, gallery images, the pill, `pre`, focus ring on linked rows |
| `rounded` | inline `code` |

Never `rounded-full` on rectangles or `rounded-none` on images. Images are
always rounded.

## Breakpoints

Mobile-first. `sm` (640px) is the main layout switch (stacking → rows); `md`
only for the home headline + pill row; `lg`/`xl` only for image bleed.
