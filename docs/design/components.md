# Components

Every shared component. Check here before building anything. There is no
`components/ui/` yet — no shadcn primitives are installed. Add one with
`npx shadcn add <name>` rather than hand-writing a button, dialog, or tooltip,
then document it here.

Links (`TextLink` and the other three treatments) are in [links.md](links.md).
`Container` is in [layout.md](layout.md). Motion components are in
[motion.md](motion.md).

## SectionLabel (Decided)

`components/section-label.tsx`. Heading for a home-page section: mono,
semibold, uppercase, with a trailing 24px Phosphor icon. Renders an `h2`.

Use it for every home section heading, including footer columns. Inner pages
use a plain `h1`/`h2` until they're redesigned.

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

Private to `app/page.tsx`. Horizontal snap-scrolling row of 570px cards with a
4:3 `bg-muted rounded-xl` image slot and text `mt-5` below. Use for rows of
work on the home page. For a grid of projects on an inner page, use
`ProjectCard`. Layout details in [layout.md](layout.md).

Card text: company in home metadata style, then the title. In "Other work",
titles are `muted` or not per the Figma — that flag is data, not a variant.

## ProfessionPill (Decided)

`components/profession-pill.tsx`. The one-off cycling pill in the home intro.
Not a general pill or badge — don't reuse it or copy its styling for tags.
Motion spec in [motion.md](motion.md).

## ProjectCard (Provisional)

`components/project-card.tsx`. Async Server Component. Card for the
`/projects` grid (`sm:grid-cols-2`, `gap-x-8 gap-y-14`). Handles both shapes:
an `external` project links out and shows a trailing `ArrowUpRightIcon`;
others link to their case study. 4:3 cover, `rounded-lg`, 1.02 scale on hover.

## PostLink (Provisional)

`components/post-link.tsx`. One row in the `/blog` list: title + date on one
line, summary below. Text only — images live inside posts. Rows are separated
by the parent's `divide-y divide-border`.

On the home page, writing rows are inline in `app/page.tsx` (date left, title
right, hairline border) — a different, Decided design. Don't swap one for the
other.

```
Listing posts?
 ├── On the home page → the inline writing row in app/page.tsx
 └── On /blog → <PostLink>
Listing projects?
 ├── On the home page → WorkStrip + WorkCard
 └── On /projects → <ProjectCard>
```

## Figure + Gallery

`components/content/figure.tsx`. Async Server Components. In MDX they are
pre-bound to the entry — write `<Figure src="hero.jpg" />` with a bare
filename. In TSX pass `collection` and `slug`.

- `Figure` — one image. Props: `src`, `alt`, `caption`, `bleed` (default
  `prose`), `priority` (first above-the-fold image only).
- `Gallery` — 2 or 3 images side by side. `columns`: `2` (default) | `3`.
  `bleed` defaults to `wide`.

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

## SiteHeader, SiteFooter, ThemeToggle (Provisional)

Global chrome in `app/layout.tsx`, hidden on `/`. The header is sticky with a
frosted background; nav items come from `site.nav` in `lib/site.ts` — add
pages there, not in the component. `ThemeToggle` swaps icons with
`dark:hidden` / `dark:block` rather than a mounted flag; keep it that way.

## NoidaTime

`components/noida-time.tsx`. Live Asia/Kolkata clock, `tabular-nums`,
lowercase `10:25pm`. Home footer only.

## Lists

Every `ul`/`ol` without bullets gets `role="list"` — Tailwind removes
`list-style`, and Safari then stops announcing it as a list. `RevealGroup`
adds it automatically; hand-written lists (home Contact, `SiteHeader`,
`SiteFooter`) set it explicitly. Prose lists keep their bullets and don't
need it.

```tsx
// Correct — components/site-footer.tsx
<ul role="list" className="flex flex-wrap items-center gap-x-5 gap-y-2">

// Incorrect — announced as plain text in Safari
<ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
```

## Focus

Custom focusable elements use
`focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none`
(add `focus-visible:ring-offset-4` on image cards). Never remove focus styling
without replacing it.
