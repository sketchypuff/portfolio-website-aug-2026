# Color

Source: `app/globals.css`. Light values live on `:root`, dark values on
`.dark`; the `@theme inline` block turns each `--token` into Tailwind classes
(`--muted-foreground` → `text-muted-foreground`, `bg-muted-foreground`, …).

## Where the colors come from

| Origin | Tokens | Status |
| --- | --- | --- |
| **shadcn `neutral` preset**, verbatim (`components.json` → `"baseColor": "neutral"`) | every gray: `background`, `foreground`, `muted`, `muted-foreground`, `border`, `ring`, plus `destructive` and all the unused ones | **Default** — generated, never compared against Figma |
| **Project-defined, from Figma** | `link` — `#2148f9` in light (`--blue-600`); `--blue-300` in dark for contrast | **Decided** |
| **Project-defined, derived** | the `--blue-50…950` scale, built from the link blue | **Decided** — primitives, see below |
| **Project-defined** | `success` / `success-foreground` — green, hue 150 | **Decided** — confirmation only |
| **Tailwind default, not a token** | the shadow color inside `shadow-xs` (black at 5% opacity) | **Default** — the one color on the site outside the token system |
| **Browser default** | text selection, caret, scrollbars | Unstyled |

The whole ramp has zero chroma — pure gray — so the only hues on the site are
`link` and, for a confirmed action only, `success`. Replacing the grays with Figma values is a change to `globals.css`
only; nothing else hardcodes them.

## Blue scale (primitives)

`--blue-50` … `--blue-950` on `:root` in `globals.css`, built from the link
blue: hue fixed at 266, lightness evenly spaced from 0.97 (50) to 0.22 (950),
chroma a fraction of the sRGB ceiling at each step — so every step renders
faithfully and none drifts toward violet. Step **600 is the link blue
exactly**; `--link` is `var(--blue-600)` in light and `var(--blue-300)` in
dark.

| Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L | 0.97 | 0.894 | 0.817 | 0.741 | 0.665 | 0.588 | 0.512 | 0.439 | 0.366 | 0.293 | 0.22 |
| C | 0.008 | 0.033 | 0.065 | 0.106 | 0.159 | 0.215 | 0.262 | 0.263 | 0.179 | 0.11 | 0.06 |

Text on white passes WCAG AA (4.5:1) from **600** down; text on the dark
background (`0.145`) passes from **500** up.

The scale sits outside `@theme` on purpose, so it produces no `bg-blue-500`
classes. Components never reference a step. To use one, add a semantic token
in `globals.css` that points at it (`--link-subtle: var(--blue-100)`), give
it a dark value (the mirrored step: 100 ↔ 900, 200 ↔ 800), and document it
here. Tailwind's own `blue-*` palette stays banned.

## The layer rule

Components use the semantic classes below. Never write `oklch()`, a hex value,
`var(--…)` in a class, or a Tailwind palette color (`text-neutral-500`,
`text-blue-600`). Every token has a light and a dark value; a raw value has
only one, so it breaks in the other theme. **One exception:** the hover page-background
palettes (`selectedWork` in `app/page.tsx`) are hex — the shader needs literals.

## Tokens in use

| Class | Light | Dark | Used for |
| --- | --- | --- | --- |
| `bg-background` | `oklch(1 0 0)` white | `0.145` | page (`body`, set in `globals.css` and `app/layout.tsx`); `ProfessionPill` surface |
| `text-foreground` | `0.145` | `0.985` | all default text (inherited from `body`); prose `strong` |
| `text-muted-foreground` | `0.556` | `0.708` | secondary text: intro paragraph, metadata, company names, dimmed titles, post subtitle, prose list numbers and bullets, figure captions, blockquotes; quiet-link hover |
| `bg-muted` | `0.97` | `0.269` | empty image slots (`WorkCard`), image placeholders (`Figure`, `Gallery`), `IconCircle`, inline `code`, `pre` |
| `border-border` | `0.922` | white 10% | default for every border (set on `*` in `globals.css`); `ProfessionPill`, prose `blockquote`, `hr`, table cells |
| `ring` (via `outline-ring/50`) | `0.708` | `0.556` | the focus outline on every element (set on `*` in `globals.css`) |
| `text-link` | `var(--blue-600)` = `#2148f9` | `var(--blue-300)` = `#8ca9ef` | `TextLink`, `ThemeTextToggle`, the `ProfessionPill` icon |
| `bg-success` / `text-success-foreground` | `0.52 0.14 150` / `0.985` (4.95:1) | `0.8 0.15 150` / `0.145` (11.2:1) | the `CopyEmail` tooltip once copied — nothing else |
| `text-destructive` / `border-destructive` | red, `0.577 0.245 27` | red, `0.704 0.191 22` | `MdxError` in `components/content/mdx.tsx` only |

Grays are listed by OKLCH lightness (`0.145` = `oklch(0.145 0 0)`). Dark
`link` is a lighter step of the same scale (300, not an inversion of 600) so
it holds 8.5:1 contrast on the dark background. Dark `border` is translucent
white so it reads on any dark surface.

## Usage map by file

| File | Tokens |
| --- | --- |
| `app/globals.css`, `app/layout.tsx` | `background`, `foreground`, `border`, `ring/50` (global defaults) |
| `app/page.tsx` | `muted-foreground` (intro, metadata, dimmed titles, quiet-link hover), `foreground/50` (row hairline) |
| `components/text-link.tsx`, `components/theme-toggle.tsx` | `link` |
| `components/ui/tooltip.tsx`, `components/copy-email.tsx` | `foreground` / `background` (tooltip); `success` / `success-foreground` (copied) |
| `components/profession-pill.tsx` | `background`, `border`, `shadow-xs`, `link` (icon) |
| `components/work-strip.tsx` | `muted` (image slot, stepper pill), `muted-foreground` / `foreground` (stepper ticks) |
| `components/content/figure.tsx` | `muted` (placeholder), `muted-foreground` (caption) |
| `components/icon-circle.tsx` | `muted` (circle) |
| `components/content/post-nav.tsx` | `muted-foreground` (title hover) |
| `app/blog/[slug]/page.tsx` | `muted-foreground` (subtitle), `border` (header rule) |
| `components/content/mdx.tsx` | `muted`, `muted-foreground`, `foreground`, `border`, `destructive`, `muted-foreground/40` |

`app/design/page.tsx` renders every token as a swatch; it is a specimen, not a
usage. When a file starts or stops using a token, update this table.

## Tokens that exist but are not used

`primary`, `secondary`, `accent`, `popover`, `card`, `input`, `chart-1…5`,
`sidebar-*`. They ship with shadcn and are consumed inside shadcn primitives if
any get added to `components/ui/`. Do not use them in hand-written components —
they are neutral grays that duplicate `muted`/`foreground`, and using them
creates a second name for the same color. (`sidebar-primary` in dark mode is
shadcn's stock blue, unrelated to `link`.)

## Opacity modifiers

Opacity on a token is allowed only in these existing combinations. Anything
else is a new token decision — add it to `globals.css` and this table instead.

| Combination | Where | Why |
| --- | --- | --- |
| `border-foreground/50` + `border-b-[0.5px]` | home writing rows | Figma hairline |
| `decoration-muted-foreground/40` | prose links | underline quieter than text |
| `outline-ring/50` | every element, `globals.css` | shadcn default focus outline |
| `border-destructive/40` | `MdxError` | error box |

## What background do I use?

```
Is it the page itself?
 ├── Yes → bg-background (already on body — don't repeat it)
 └── No
      ├── An image slot, image placeholder, icon circle, or code? → bg-muted
      ├── A raised control on the page (the ProfessionPill)?
      │    → bg-background + border-border + shadow-xs
      └── Anything else → no background. This site separates with space, not boxes.
```

## What text color do I use?

```
Is it a navigation link or the theme switch?
 ├── Yes → TextLink / ThemeTextToggle (text-link) — see links.md
 └── No
      ├── Primary content: titles, body, labels → inherit (foreground)
      ├── Secondary: metadata, dates, company names, intro paragraph,
      │   dimmed titles, captions → text-muted-foreground
      └── An error → text-destructive
```

Two text levels carry the site. Never add a third gray
(`text-muted-foreground/70` and the like) — hierarchy below muted comes from
size or case, not a lighter gray.

```tsx
// Correct — app/page.tsx
<p className="text-muted-foreground font-mono text-sm uppercase">{item.company}</p>

// Incorrect — palette color, breaks dark mode and bypasses the ramp
<p className="text-neutral-500 font-mono text-sm uppercase">{item.company}</p>
```

The one non-link use of blue is the `ProfessionPill` icon, taken from Figma.
It is an exception, not a precedent.
