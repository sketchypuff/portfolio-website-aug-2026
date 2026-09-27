# Components

Every shared component. Check here before building anything. shadcn
primitives live in `components/ui/`; the only one installed is `tooltip`. Add
more with `npx shadcn add <name>` (fix a `"cn"` import to `@/lib/utils` and
uninstall `cn`) rather than hand-writing a primitive, then document it here.

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
4:3 `bg-muted rounded-xl` image slot and text `mt-5` below, under a row
with the section heading left and a tick stepper right (spec in
[layout.md](layout.md#horizontal-strips-decided)). Client component. Pass
`heading` (the section's `SectionLabel` — the strip renders it, so don't add
one above), `name` (the stepper's group label, usually the section
name) and `labels` (one screen-reader label per card, in card order). Use for rows of
work on the home page. Layout details in [layout.md](layout.md). `WorkStrip` needs an
`@container overflow-x-clip` ancestor spanning the viewport, and its gutter
assumes it sits in `Container size="home"`.

`dimOnHover` (optional): while a card is hovered, every other card fades
to `opacity-50`, telling the hovered one apart. Keyed on a hovered `li`, so
the gaps don't dim anything; un-dimming waits 100ms so crossing a gap
doesn't flash. Hovering devices only. "Selected work" sets it; "Other work"
doesn't.

Card text: company in home metadata style, then the title. In "Other work",
titles are `muted` or not per the Figma — that flag is data, not a variant.

## ProfessionPill (Decided)

`components/profession-pill.tsx`. The one-off cycling pill in the home intro.
Not a general pill or badge — don't reuse it or copy its styling for tags.
After the first full lap of five it shows one extra label, "that’s all of
me" (winking smiley), then wraps to "product designer"; later laps skip it.
Motion spec in [motion.md](motion.md).

## Figure + Gallery (Decided from Figma "Blog")

`components/content/figure.tsx`. Async Server Components. In MDX they are
pre-bound to the entry — write `<Figure src="hero.jpg" />` with a bare
filename. In TSX pass `collection` and `slug`.

- `Figure` — one image. Props: `src`, `alt`, `caption` (text, or a JSX
  fragment when it needs a link — `<a>` inside still gets the prose link
  style), `bleed` (default
  `prose`), `priority` (first above-the-fold image only).
- `Gallery` — 2 or 3 images side by side. `columns`: `2` (default) | `3`.
  `bleed` defaults to `wide`.

Rendered inside MDX entries in `content/`, on `/blog/[slug]`. Bleed widths
are in [layout.md](layout.md#image-bleed-decided-for-prose-and-wide).

Alt text: always pass `alt` for images that carry information. `caption`
doubles as alt when `alt` is absent. Decorative images pass `alt=""`
deliberately. Images are always `rounded-xl` on `bg-muted` with a blur
placeholder — never override with `className`.

```mdx
<!-- Correct -->
<Figure src="flow.png" alt="Old vs new checkout flow" bleed="wide" />

<!-- Incorrect — bypasses the loader: no blur, no dimensions, layout shift -->
![Old vs new checkout flow](./images/flow.png)
```

## IconCircle (Decided)

`components/icon-circle.tsx`. A 48px `bg-muted rounded-full` circle around a
24px Phosphor icon, from the Figma "Blog" back and prev/next controls. Visual
only — wrap it in the `Link`, and give an icon-only link an `aria-label`.

```tsx
// Correct — app/blog/[slug]/page.tsx
<Link href="/" aria-label="Back to home" className="inline-flex rounded-full …">
  <IconCircle icon={ArrowLeftIcon} />
</Link>

// Incorrect — a hand-rolled circle, and no accessible name
<Link href="/" className="bg-muted rounded-full p-3"><ArrowLeftIcon /></Link>
```

## PostNav (Decided)

`components/content/post-nav.tsx`. The older/newer row at the foot of a post:
older on the left with `ArrowLeftIcon`, newer on the right with
`ArrowRightIcon`, each one quiet link around an `IconCircle` and the title.
Feed it `getAdjacentPosts(slug)` from `lib/content.ts`; a missing side is left
empty, and it renders nothing when both are missing.

## Home writing rows

Inline in `app/page.tsx`: date left (home metadata style), title right,
`border-b-[0.5px] border-foreground/50` hairline on the `li`, `py-3` on the
row. A row with an `href` is one `Link` (the linked-row pattern in
[links.md](links.md)); rows without one stay plain text until their post
exists. Use this row, not a new one, for any dated list on the home page.

## NoidaTime

`components/noida-time.tsx`. Live Asia/Kolkata clock, `tabular-nums`,
lowercase `10:25pm`, plus a muted guess at what Yash is doing, from the
`weekday` / `weekend` schedules in the file. Home footer only.

## Oneko

`components/oneko.tsx`. A 32px pixel cat that chases the cursor, ported from
[oneko.js](https://github.com/adryd325/oneko.js) (MIT) into a client
component so it mounts and unmounts with the page. Sprite sheet at
`public/oneko.png`: the `silversky` skin from
[onekocord](https://github.com/onekocord/onekocord), which has no licence
file. Any 256×128 oneko sheet drops in without code changes. Rendered
`image-rendering: pixelated`. Home only — mounted once at the top of
`app/page.tsx`. Decorative: `aria-hidden`, no pointer
events. Renders nothing under reduced motion or without a fine hovering
pointer (touch has no cursor to chase). No position persistence; it starts in
the top-left corner on every visit.

## CopyEmail + Tooltip

`components/copy-email.tsx`. Home Contact "Email": a quiet-link button, not
`mailto:`. Hover: "Click to copy"; click copies `site.social.email` and the
same bubble morphs (the `ProfessionPill` label swap, 200ms colour fade) into a
green `bg-success` "✓ Copied" until the pointer leaves (1.5s on touch).
Falls back to the mail app if copying fails. Bubble: shadcn
`components/ui/tooltip.tsx` plus an `arrowClassName` prop; wrap each use in a
`TooltipProvider` and add `motion-reduce:animate-none` to `TooltipContent`.

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
