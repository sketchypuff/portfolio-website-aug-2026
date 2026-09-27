# Components

Every shared component. Check here before building anything. There is no
`components/ui/` yet — no shadcn primitives are installed. Add one with
`npx shadcn add <name>` rather than hand-writing a button, dialog, or tooltip,
then document it here.

Links (`TextLink`, `ThemeTextToggle`, and the other link treatments) are in [links.md](links.md).
`Container` is in [layout.md](layout.md). Motion components are in
[motion.md](motion.md).

## SectionLabel (Decided)

`components/section-label.tsx`. Heading for a home-page section: mono,
semibold, uppercase, with a trailing 24px Phosphor icon. Renders an `h2`.

Use it for every home section heading, including footer columns.

Icon picks so far: `CrownIcon` (Selected work), `PenNibIcon` (Writing),
`HandHeartIcon` (Other work), `IdentificationCardIcon` (Contact),
`WarningCircleIcon` (Last updated), `ClockIcon` (Currently). Pick icons with
character — these are chosen for personality, not literal meaning.

```tsx
// Correct
<SectionLabel icon={PenNibIcon}>Writing</SectionLabel>

// Incorrect — rebuilt by hand, loses the h2 and the icon size
<p className="font-mono text-sm uppercase">Writing</p>
```

## WorkStrip + WorkCard (Decided, home only)

`components/work-strip.tsx`. Horizontal snap-scrolling row of 570px cards with a
4:3 `bg-muted rounded-xl` image slot and text `mt-5` below. Use for rows of
work on the home page. Layout details in [layout.md](layout.md). `WorkStrip` needs an
`@container overflow-x-clip` ancestor spanning the viewport, and its gutter
assumes it sits in `Container size="home"`.

Card text: company in home metadata style, then the title. In "Other work",
titles are `muted` or not per the Figma — that flag is data, not a variant.

## ProfessionPill (Decided)

`components/profession-pill.tsx`. The one-off cycling pill in the home intro.
Not a general pill or badge — don't reuse it or copy its styling for tags.
Motion spec in [motion.md](motion.md).

## Figure + Gallery (Provisional)

`components/content/figure.tsx`. Async Server Components. In MDX they are
pre-bound to the entry — write `<Figure src="hero.jpg" />` with a bare
filename. In TSX pass `collection` and `slug`.

- `Figure` — one image. Props: `src`, `alt`, `caption`, `bleed` (default
  `prose`), `priority` (first above-the-fold image only).
- `Gallery` — 2 or 3 images side by side. `columns`: `2` (default) | `3`.
  `bleed` defaults to `wide`.

Rendered inside MDX entries in `content/`. No page renders entries right now —
the pipeline is kept for the rebuilt blog and case studies.

Alt text: always pass `alt` for images that carry information. `caption`
doubles as alt when `alt` is absent. Decorative images pass `alt=""`
deliberately. Images are always `rounded-lg` on `bg-muted` with a blur
placeholder — never override with `className`.

```mdx
<!-- Correct -->
<Figure src="flow.png" alt="Old vs new checkout flow" bleed="wide" />

<!-- Incorrect — bypasses the loader: no blur, no dimensions, layout shift -->
![Old vs new checkout flow](./images/flow.png)
```

## Home writing rows

Inline in `app/page.tsx`: date left (home metadata style), title right,
`border-b-[0.5px] border-foreground/50` hairline, `py-3`. Not linked yet. Use
this row, not a new one, for any dated list on the home page.

## NoidaTime

`components/noida-time.tsx`. Live Asia/Kolkata clock, `tabular-nums`,
lowercase `10:25pm`. Home footer only.

## Lists

Every `ul`/`ol` without bullets gets `role="list"` — Tailwind removes
`list-style`, and Safari then stops announcing it as a list. `RevealGroup`
adds it automatically; hand-written lists (the home Contact list) set it
explicitly. Prose lists keep their bullets and don't need it.

```tsx
// Correct — app/page.tsx
<ul role="list">

// Incorrect — announced as plain text in Safari
<ul>
```

## Focus

Custom focusable elements use
`focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none`
(add `focus-visible:ring-offset-4` on image cards; a row that is one link
gets `-mx-3 px-3 rounded-lg` so the ring clears the text while the text stays
on the column edge). Never remove focus styling
without replacing it.
