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

Use it for every home section heading. Footer columns don't use it: their
labels are plain mono text with no icon (see `SiteFooter`).

Icon picks so far: `CrownIcon` (Selected work), `PenNibIcon` (Writing),
`HandHeartIcon` (Other work). Pick icons with
character — these are chosen for personality, not literal meaning.

```tsx
// Correct
<SectionLabel icon={PenNibIcon}>Writing</SectionLabel>

// Incorrect — rebuilt by hand, loses the h2 and the icon size
<p className="font-mono text-sm uppercase">Writing</p>
```

## Home v2 layout

`app/page.tsx` on `home-v2`, after emmiwu.com. Full-bleed (see
[layout.md](layout.md)): a sticky sidebar left, three stacked sections right,
`gap-28` between them, then `SiteFooter`.

- **Sidebar** (`md:sticky md:top-14`): `h1` + `ProfessionPill`, the intro
  paragraph, then "`ThemeInlineToggle`, say hello on LinkedIn or open my
  resumé." (links), then the page nav.
- **Page nav**: mono uppercase Work / Writing / About, each with a `[ ]`
  marker. The current page is foreground with a dot in its brackets; the rest
  are muted, going foreground with a dot on hover.
- **Section heading**: mono uppercase label in foreground, then the count in
  muted brackets, zero-padded (`SELECTED WORK [11]`).
- **Card grid** (Selected work, Other work): 2 across, 4 across once the
  content column is ≥ 48rem (`@3xl`), `gap-x-3`. Image slot `bg-muted`,
  square corners, Emmi's 268.75:264 ratio. Title `text-sm`; under it a mono
  meta line — the company (Selected work) or `COMING SOON` (Other work).
  Selected work adds `VIEW [ ]` at the right below `lg` (phones, tablets);
  at `lg` and up it's hidden and the cursor's "Open case study" label does
  that job.
- **Blog rows**: date | title | `READ [ ]`, hairlines as before, cursor "Read".
- Counts: 11 Selected work, 8 Other work — the entries repeat until real
  projects replace them.

`Marker` and `SectionHeading` are page-local. `WorkStrip`, `SectionLabel`,
`TextLink` and `ThemeTextToggle` are no longer on home; `/design` still
renders them.

## WorkStrip + WorkCard (Decided, `/design` only on home-v2)

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

## Home writing rows (main's home)

Inline in `app/page.tsx`: date left (home metadata style), title right,
`border-b-[0.5px] border-foreground/50` hairline on the `li`, `py-3` on the
row. A row with an `href` is one `Link` (the linked-row pattern in
[links.md](links.md)); rows without one stay plain text until their post
exists. Use this row, not a new one, for any dated list on the home page.
Linked rows carry `data-cursor-text="Read"` for the `CustomCursor` label.
"Selected work" cards pass `cursorText="Open case study"` to `WorkCard`.

## CustomCursor (Decided)

`components/custom-cursor.tsx`, mounted once in `app/layout.tsx`, after
rachelchen.tech. A sharp `bg-link` square replaces the system cursor
(`html.has-custom-cursor` in `globals.css` sets `cursor: none` everywhere):

- Resting: 14×14, centred on the pointer.
- Over anything clickable (`a[href]`, `button`, `[role=button]`, form
  controls, `[data-cursor-text]`): 8×8. Size changes ease over 120ms.
- Over selectable text or a text field: a 3×20 caret, snapping in. Leaving
  text waits 90ms so the gaps between words don't flicker it.
- Pressed: `scale(0.75)` over 100ms, unless a label is showing.
- `data-cursor-text="…"` on an element types that label out beside the square
  (`text-link`, mono, uppercase, `text-sm`, 10px gap) on an ease-out over at most 160ms,
  and deletes it the same way on exit. Keep labels to one short verb.
- Over an `.inverted` band (the footer) it inverts too: the dark-mode
  orange on a light page, the light-mode red on a dark one.

Only for `(hover: hover) and (pointer: fine)` wider than 768px. On touch,
narrow screens, or reduced motion it renders nothing and the system cursor
stays. Rachel's link-preview cards (OG images on external links) were not
ported. It is the link color — one of the two non-link uses (see
[color.md](color.md)).

## NoidaTime

`components/noida-time.tsx`. Live Asia/Kolkata clock, `tabular-nums`,
lowercase `10:25pm`, plus a muted guess at what Yash is doing, from the
`weekday` / `weekend` schedules in the file. `SiteFooter` only.

## SiteFooter (Decided)

`components/site-footer.tsx`. A full-bleed band after the home page,
modelled on emmiwu.com's footer. It uses the home v2 frame (`px-6 sm:px-8`,
260px / 300px first column at `md` / `lg`): `NoidaTime` under the sidebar,
then "Say hi" (Email, LinkedIn, Resumé) and "Page" (Work, Writing, About) as
labelled `nav`s on the card grid's second and third columns, as on
emmiwu.com, so their left edges line up with the cards above. Where the grid
is two across, they take its two columns; on phones the clock stacks above
them. All
mono `text-sm` uppercase. Labels are foreground; links are muted and go to
foreground on hover (the quiet link, inverted — see
[links.md](links.md#quiet-link-decided)).

It is always the opposite of the page: the `inverted` class on the `<footer>`
gives the band the other theme's tokens (dark on a light page, light on a
dark one), so it uses `bg-background` / `text-foreground` with no raw colour
and needs no border in either theme. Home only for now; when inner
pages get a footer, use this one.

```tsx
// Correct — app/page.tsx, after the Container
</Container>
<SiteFooter />

// Incorrect — a second footer, or the band rebuilt with raw colours
<footer className="bg-neutral-950 text-white">…</footer>
```

## CopyEmail + Tooltip

`components/copy-email.tsx`. The footer's "Email": a quiet-link button, not
`mailto:`. Hover: "Click to copy"; click copies `site.social.email` and the
same bubble morphs (the `ProfessionPill` label swap, 200ms colour fade) into a
green `bg-success` "✓ Copied" until the pointer leaves (1.5s on touch).
Falls back to the mail app if copying fails. Bubble: shadcn
`components/ui/tooltip.tsx` plus an `arrowClassName` prop; wrap each use in a
`TooltipProvider` and add `motion-reduce:animate-none` to `TooltipContent`.
`className` replaces the default hover treatment (the footer passes the
inverted quiet link plus `uppercase`, since Preflight resets
`text-transform` on buttons).

## Lists

Every `ul`/`ol` without bullets gets `role="list"` — Tailwind removes
`list-style`, and Safari then stops announcing it as a list. `RevealGroup`
adds it automatically; hand-written lists (the `SiteFooter` columns) set it
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
