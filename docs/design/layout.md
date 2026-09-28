# Layout, spacing, radius

## Page width — `<Container size>`

Source: `components/container.tsx`. Every page wrapper is a `Container`. It
supplies the gutter (`px-6`, `sm:px-8`) and centering. Never hand-roll
`max-w-*` or horizontal padding on a page wrapper.

Sizes: `home`, `article`, `articleWide`, `prose`, `default`, `wide`. Nothing
else exists.

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
- Post page (Figma "Blog"): back link `pt-10`, header `mt-4` below it, 80px
  (`mt-20` / `my-20`) between the header, body sections and figures, 24px
  (`my-6` / `mb-6`) between elements inside a section, prev/next row `mt-24`,
  page `pb-16`.

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

The section heading and a tick stepper share one row above the strip
(`justify-between`, `items-center`, `gap-8` to the cards): heading left,
stepper right. The stepper has one 2px tick
per card in a 40px-wide, 32px-tall button, the current tick `h-3.5
bg-foreground`, the rest `h-3 bg-muted-foreground` (hover `bg-foreground`), with a
`cursor-pointer` hand.
A 26×28 `bg-muted rounded-md` pill slides behind the current tick; on the
last tick its right edge sits on the column edge (`-mr-[7px]` on the group). Clicking a tick
selects it at once and scrolls its card to the snap edge; scrolling updates the tick (nearest snap
point, and the last card once the strip hits its end). Pressing a tick, or
scrolling onto a new card, plays Cuelume's `tick` sound — see
[motion.md](motion.md#sound).

If the home column width (875px) changes, update `Container`'s `home` size
**and** the two `--gutter` expressions in `WorkStrip` together.

## Image bleed (Decided for `prose` and `wide`)

`<Figure bleed>` / `<Gallery bleed>` in `components/content/figure.tsx`:
`prose` | `wide` | `full`. Nothing else exists.

```
Is the image a screenshot of UI whose detail must be legible?
 ├── Yes → bleed="wide" (Gallery defaults to this)
 └── No
      ├── A hero or mood image that should dominate → bleed="full"
      └── Default → bleed="prose" (Figure defaults to this)
```

- `prose`: column width (700px on the post page).
- `wide`: 1323px, centered on the column (Figma "Blog"), shrinking to the
  page minus its gutters on narrower screens.
- `full` (Provisional, not in Figma): the page minus its gutters.

Bleed is a negative margin measured in `cqw`, so the page needs an
`@container overflow-x-clip` wrapper (the post page has one). It only applies
at `lg`+; below that everything is column width. Figures sit `my-20` — the
80px block rhythm. The `BLEED` classes and `imageSizes()` are paired, and
both assume `Container size="article"`: changing a width without the other
makes the browser download the wrong image size.

## Selection roots (Decided)

Any element holding a reading column needs `selection-root` (defined in
`app/globals.css`). The post page has it on `<article>`.

WebKit — which includes Safari and every macOS in-app browser — fills
text-selection *gaps* out to the edges of the nearest **selection root**: an
ancestor that clips, has a transform, or is a flex/grid item. Without one
close by, dragging across prose paints the highlight the full width of the
window rather than the column. Chromium dropped this behaviour, so it looks
correct there and wrong in Safari.

The `@container overflow-x-clip` wrapper that image bleed depends on is
full-width, which makes it exactly the wrong selection root — hence the
explicit one on the column inside it.

`selection-root` is an identity `transform`, not `overflow: clip`. Clipping
would also work, but it would crop `wide` and `full` figures, which exist to
escape the column. The transform is layout-neutral: it changes no geometry
and does not disturb margin collapsing the way making the column a flex
container would.

## Radius

`--radius` is `0.625rem`. In use:

| Class | Where |
| --- | --- |
| `rounded-xl` | home work cards, figures, gallery images, `pre` (Figma) |
| `rounded-lg` | the pill, focus ring on linked rows |
| `rounded-full` | `IconCircle` — circles only |
| `rounded` | inline `code` |

Never `rounded-full` on rectangles or `rounded-none` on images. Images are
always rounded.

## Breakpoints

Mobile-first. `sm` (640px) is the main layout switch (stacking → rows) and
the post title size step; `md` only for the home headline + pill row; `lg`
only for image bleed.
